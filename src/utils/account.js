import { radarToken } from '../api/radar';

export const getToken = async params => {
  try {
    const { data = {} } = await radarToken(params);
    const { tokenHead, token } = data;
    localStorage.setItem('userInfo', JSON.stringify(params));
    localStorage.setItem('token', tokenHead + token);
  } catch (error) {
    if (error?.data?.code === 500) {
      ElMessage({ message: error.data.message, type: 'error' });
      throw new Error(error.data.message);
    }
  }
};
