import { radarToken } from '../api/radar';
import { GlobalStore } from '@/store';

export const getToken = async params => {
  try {
    const { data = {} } = await radarToken(params);
    const { tokenHead, token } = data;
    const globalStore = GlobalStore();
    globalStore.setGlobalState({ radarToken: tokenHead + token, userInfo: params });
  } catch (error) {
    if (error?.data?.code === 500) {
      ElMessage({ message: error.data.message, type: 'error' });
      throw new Error(error.data.message);
    }
  }
};
