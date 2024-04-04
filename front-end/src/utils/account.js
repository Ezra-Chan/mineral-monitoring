import dayjs from 'dayjs';
import { radarToken } from '@/api/radar';
import { useUserStore } from '@/store/user';
import { useTabsStore } from '@/store/tabs';
import { useKeepAliveStore } from '@/store/keepAlive';
import { initDynamicRouter } from '@/router/dynamicRouter';

let isPending = false;

export const getToken = async params => {
  try {
    const userStore = Number(JSON.parse(localStorage.getItem('user-state') || '{}'));
    const { radarTokenTime = 0, radarToken: token } = userStore;
    if ((!token || dayjs().valueOf() - radarTokenTime > 24 * 60 * 60 * 1000) && !isPending) {
      isPending = true;
      const { data = {} } = await radarToken(params);
      const { tokenHead, token } = data;
      const userStore = useUserStore();
      const tabsStore = useTabsStore();
      const keepAliveStore = useKeepAliveStore();

      userStore.setToken(tokenHead + token);
      userStore.setUserInfo(params);
      // 添加动态路由
      await initDynamicRouter();

      // 清空 tabs、keepAlive 数据
      tabsStore.closeMultipleTab();
      keepAliveStore.setKeepAliveName();

      isPending = false;
      return true;
    }
    return false;
  } catch (error) {
    if (error?.data?.code === 500) {
      ElMessage({ message: error.data.message, type: 'error' });
      throw new Error(error.data.message);
    }
  }
};
