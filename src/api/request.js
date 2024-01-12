import axios from 'axios';
import { getToken } from 'utils/account';

let apiContextPath = '';
if (import.meta.env.DEV) {
  apiContextPath = '/api';
}

export const getInstance = (prefix = 'shmanage') => {
  if (prefix) {
    prefix.startsWith('/') && (prefix = prefix.slice(1, prefix.length));
    prefix.endsWith('/') && (prefix = prefix.slice(0, -1));
  }
  const instance = axios.create({
    baseURL: `${apiContextPath}/${prefix ? prefix + '/' : ''}`,
    timeout: 60000,
    validateStatus: status => status >= 200 && status < 300,
    headers: localStorage.getItem('token') ? { Authorization: localStorage.getItem('token') } : {},
  });

  instance.defaults.headers.post['Content-Type'] = 'application/json';

  instance.interceptors.response.use(
    async response => {
      let { data, request = {}, config = {} } = response;
      if (request.responseType === 'arraybuffer') {
        response.data = data;
        return response;
      }
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      if (data && data.code !== 200 && !(data instanceof Blob)) {
        if (data.code === 401) {
          if (localStorage.getItem('userInfo')) {
            const { username, password } = JSON.parse(localStorage.getItem('userInfo'));
            await getToken({ username, password });
            // 将原请求再发一遍
            const res = await getInstance()[config.method.toLowerCase()](
              config.url,
              config.data,
              config,
            );
            return res;
          } else {
            location.href = '/login';
          }
        }
        return Promise.reject(response);
      }
      if (data instanceof Blob) {
        response.data = data;
        return response;
      }
      response.data = data && data.data;
      return response;
    },
    error => {
      if (error.response && error.response.code === 401) {
        return;
      }
      return Promise.reject(error.response);
    },
  );
  return instance;
};

export default getInstance();
