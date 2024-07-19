import Toast from "@vant/weapp/toast/toast";
import { Decrypt } from "./AES";
import { encrypt } from "./rsa";
import { SYSTEM_ROLES_MAP } from "./constant";
import { getRadarToken } from "../api/radar/index";
import {
  loginApi,
  refreshTokenApi,
  revokeAccessApi,
  revokeRefreshApi,
  getCurrentUserApi,
} from "../api/platform/index";
import { userStore } from "../store/user";

let isPending = false;
let kexinPending = false;

// 登录可信仓
export const kexinLogin = async () => {
  try {
    if (!kexinPending) {
      kexinPending = true;
      const { radarUser } = wx.getStorageSync("userStore") || {};
      if (radarUser) {
        const radarUserInfo = {
          username: radarUser.u,
          password: Decrypt(radarUser.p),
        };
        const { data = {} } = await getRadarToken(radarUserInfo);
        const { tokenHead, token } = data;
        userStore.setStore({
          radarToken: tokenHead + token,
        });
        kexinPending = false;
        return true;
      }
    }
    return false;
  } catch (e) {
    kexinPending = false;
    if (error?.data?.code === 500) {
      Toast.fail(error.data.message);
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

// 登录本平台
export const monitoringLogin = async (params = {}) => {
  const info = { ...params, password: encrypt(Decrypt(params.password)) };
  const { access_token, refresh_token } = await loginApi(info);
  userStore.setToken(access_token, refresh_token);
};

// 刷新token
const refreshMonitoringToken = async () => {
  const { access_token } = await refreshTokenApi();
  userStore.setToken(access_token);
};

export const getToken = async (params, flag) => {
  const { userInfo, token } = wx.getStorageSync("userStore") || {};
  if (!userInfo && !params) {
    return wx.reLaunch({ url: "/pages/login/login" });
  }
};

// 退出登录
export const logoutMonitoring = async () => {
  await Promise.all([revokeAccessApi(), revokeRefreshApi()]);
};

export const isAdmin = () => {
  return userStore.userInfo?.role_id === SYSTEM_ROLES_MAP.SUPER_ADMIN;
};

export const getCurrentUser = async () => {
  try {
    const { user = {} } = await getCurrentUserApi();
    userStore.setStore({ userInfo: user });
  } catch (error) {}
};
