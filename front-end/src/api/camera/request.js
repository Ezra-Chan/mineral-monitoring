import axios from 'axios';
import { Decrypt } from '@/utils/AES';

let apiContextPath = '';
apiContextPath = '/api2';

export const getInstance = prefix => {
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
      if (localStorage.getItem('user-state')) {
        const { monitorUser: { u, p } = {} } = JSON.parse(localStorage.getItem('user-state'));
        config.headers.Authorization = `Basic ${btoa(`${u}:${Decrypt(p)}`)}`;
      }
    }
    return config;
  });

  instance.interceptors.response.use(
    async response => {
      let { data, request = {} } = response;
      if (request.responseType === 'arraybuffer') {
        response.data = data;
        return response;
      }
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }
      if (data instanceof Blob) {
        response.data = data;
        return response;
      }
      response.data = data;
      return response;
    },
    error => {
      if (error.response && error.response.status === 401) {
        return;
      }
      return Promise.reject(error.response);
    },
  );
  return instance;
};

export default getInstance();
