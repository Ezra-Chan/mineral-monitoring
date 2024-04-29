import axios from 'axios';
import { getToken } from '@/utils/account';
import { LOGIN_URL } from '@/config';

let apiContextPath = '';
// if (import.meta.env.DEV) {
apiContextPath = '/api4';
// } else {
// apiContextPath = 'http://localhost:3000';
// }

export const getInstance = (prefix = '') => {
  if (prefix) {
    prefix.startsWith('/') && (prefix = prefix.slice(1, prefix.length));
    prefix.endsWith('/') && (prefix = prefix.slice(0, -1));
  }
  const instance = axios.create({
    baseURL: `${apiContextPath}/${prefix ? prefix + '/' : ''}`,
    timeout: 60000,
    validateStatus: status => status >= 200 && status < 300,
  });

  instance.defaults.headers.post['Content-Type'] = 'application/json';

  instance.interceptors.request.use(config => {
    if (!config.headers) config.headers = {};
    if (!config.headers.Authorization) {
      config.headers = localStorage.getItem('user-state')
        ? { ...config.headers, Authorization: JSON.parse(localStorage.getItem('user-state')).token }
        : config.headers;
    }
    return config;
  });

  instance.interceptors.response.use(
    async response => {
      let { data, request = {}, status } = response;
      if (request.responseType === 'arraybuffer') {
        response.data = data;
        return response;
      }
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      if (!(status >= 200 && status < 300) && !(data instanceof Blob)) {
        return Promise.reject(response);
      }
      response.data = data;
      return response;
    },
    async error => {
      if (error.response && error.response.status === 401) {
        if (error.config.url === '/auth/refresh') {
          ElMessage.error('登录状态过期，请重新登录');
          window.location.href = '/#' + LOGIN_URL;
        } else {
          const flag = await getToken(undefined, true);
          if (flag) {
            ElMessage.warning('登录状态过期，已重新登录');
            window.location.href = '/';
          }
        }
        return;
      }
      return Promise.reject(error.response);
    },
  );
  return instance;
};

export default getInstance();
