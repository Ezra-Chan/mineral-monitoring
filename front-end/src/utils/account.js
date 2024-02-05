import dayjs from 'dayjs';
import { radarToken } from '../api/radar';
import { GlobalStore } from '@/store';

export const getToken = async params => {
  try {
    const radarTokenTime = Number(
      JSON.parse(localStorage.getItem('GlobalState') || '{}')?.radarTokenTime || 0,
    );
    if (dayjs().valueOf() - radarTokenTime > 24 * 60 * 60 * 1000) {
      const { data = {} } = await radarToken(params);
      const { tokenHead, token } = data;
      const globalStore = GlobalStore();
      globalStore.setGlobalState({
        radarToken: tokenHead + token,
        userInfo: params,
        radarTokenTime: dayjs().valueOf(),
      });
    }
  } catch (error) {
    if (error?.data?.code === 500) {
      ElMessage({ message: error.data.message, type: 'error' });
      throw new Error(error.data.message);
    }
  }
};
