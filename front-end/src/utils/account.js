import dayjs from 'dayjs';
import axios from 'axios';
import { getRadarToken } from '@/api/radar';
import { cameraLoginParams, cameraDomians } from '@/api/camera/constant';
import {
  loginApi,
  refreshTokenApi,
  revokeAccessApi,
  revokeRefreshApi,
  getCurrentUserApi,
} from '@/api/platform';
import { useUserStore } from '@/store/user';
import { useTabsStore } from '@/store/tabs';
import { useKeepAliveStore } from '@/store/keepAlive';
import { initDynamicRouter } from '@/router/dynamicRouter';
import { Decrypt } from '@/utils/AES';
import { encrypt } from '@/utils/rsa';
import { SYSTEM_ROLES_MAP } from '@/utils/constant';
import { ElMessage } from 'element-plus';

let isPending = false;
let kexinPending = false;

const afterLogin = async () => {
  // 添加动态路由
  await initDynamicRouter();

  // 清空 tabs、keepAlive 数据
  const tabsStore = useTabsStore();
  const keepAliveStore = useKeepAliveStore();
  tabsStore.closeMultipleTab();
  keepAliveStore.setKeepAliveName();
  isPending = false;
};

// 登录本平台
export const monitoringLogin = async (params = {}) => {
  const userStore = useUserStore();
  const info = { ...params, password: encrypt(Decrypt(params.password)) };
  const { data = {} } = await loginApi(info);
  const { access_token, refresh_token } = data;
  userStore.setToken(access_token, refresh_token);
};

// 刷新token
const refreshMonitoringToken = async () => {
  const userStore = useUserStore();
  const { data = {} } = await refreshTokenApi();
  const { access_token } = data;
  userStore.setToken(access_token);
};

// 登录视频平台
export const cameraLogin = async () => {
  try {
    const userStore = useUserStore();
    const { monitorInfo = {}, companyInfo = {} } = userStore;
    const { user, token, tokenTime = 0 } = monitorInfo;
    const { monitor_ip } = companyInfo;
    if (
      user &&
      monitor_ip?.startsWith('https://') &&
      (!token || dayjs().valueOf() - tokenTime > 23 * 60 * 60 * 1000)
    ) {
      const { u, p } = user;
      const [url, params] = cameraLoginParams({
        email: u,
        password: Decrypt(p),
      });
      const { data = {} } = await axios.post(monitor_ip + url, params);
      const { accessToken } = data;
      const { data: { domains = [] } = {} } = await axios.get(monitor_ip + cameraDomians, {
        headers: {
          Authorization: accessToken,
        },
      });
      userStore.setMonitorInfo({
        ...monitorInfo,
        token: accessToken,
        tokenTime: dayjs().valueOf(),
        domain: domains[0]?.domain?.webClientURL || '',
      });
    }
  } catch (error) {
    console.error('cameraLogin', error);
    ElMessage({ message: '监控平台登录失败', type: 'error' });
  }
};

// 登录可信仓
export const kexinLogin = async () => {
  try {
    if (!kexinPending) {
      kexinPending = true;
      const userStore = useUserStore();
      const { radarUser } = userStore;
      if (radarUser) {
        const radarUserInfo = {
          username: radarUser.u,
          password: Decrypt(radarUser.p),
        };
        const { data = {} } = await getRadarToken(radarUserInfo);
        const { tokenHead, token } = data;
        userStore.setRadarToken(tokenHead + token);
        kexinPending = false;
        return true;
      }
    }
    return false;
  } catch (error) {
    kexinPending = false;
    if (error?.data?.code === 500) {
      ElMessage({ message: error.data.message, type: 'error' });
      throw new Error(error.data.message);
    }
    throw new Error(error);
  } finally {
    const timer = setTimeout(() => {
      kexinPending = false;
      clearTimeout(timer);
    }, 2000);
  }
};

// 登录，获取token
export const getToken = async (params = {}, flag) => {
  try {
    if (!isPending) {
      const userStore = useUserStore();
      const { tokenTime = 0, token } = userStore;
      isPending = true;
      // 无token
      if (!token) {
        await Promise.all([monitoringLogin(params), kexinLogin()]);
        await afterLogin();
      }
      // token已失效
      else if (dayjs().valueOf() - tokenTime > 24 * 60 * 60 * 1000 || flag) {
        // 用 refreshToken 获取新的token
        await Promise.all([refreshMonitoringToken(), kexinLogin()]);
        await afterLogin();
      }
      return true;
    }
    return false;
  } catch (error) {
    isPending = false;
    if (error?.data?.code === 500) {
      ElMessage({ message: error.data.message, type: 'error' });
      throw new Error(error.data.message);
    }
    throw new Error(error);
  } finally {
    const timer = setTimeout(() => {
      isPending = false;
      clearTimeout(timer);
    }, 2000);
  }
};

// 退出登录
export const logoutMonitoring = async () => {
  await Promise.all([revokeAccessApi(), revokeRefreshApi()]);
};

export const isAdmin = () => {
  const userStore = useUserStore();
  return userStore.userInfo?.role_id === SYSTEM_ROLES_MAP.SUPER_ADMIN;
};

export const getCurrentUser = async () => {
  const userStore = useUserStore();
  try {
    const { data = {} } = await getCurrentUserApi();
    const { user = {} } = data;
    userStore.setUserInfo({ ...user, sex: Number(user.sex) });
  } catch (error) {}
};
