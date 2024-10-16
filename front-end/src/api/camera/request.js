import axios from 'axios';
import { Decrypt } from '@/utils/AES';
import { cameraLoginParams } from './constant';

let apiContextPath = '';
// if (import.meta.env.DEV) {
//   apiContextPath = '/api2';
// }

export const getInstance = () => {
  const instance = axios.create({
    baseURL: apiContextPath,
    timeout: 60000,
    validateStatus: status => status >= 200 && status < 300,
  });

  instance.defaults.headers.post['Content-Type'] = 'application/json';

  instance.interceptors.request.use(config => {
    const { companyInfo, monitorInfo: { user: { u, p } = {}, token, domain } = {} } = JSON.parse(
      localStorage.getItem('user-state') || '{}',
    );
    if (apiContextPath) {
      config.baseURL = apiContextPath;
    } else if (!apiContextPath && companyInfo) {
      config.baseURL = domain ? 'https:' + domain : companyInfo.monitor_ip;
    }
    if (!config.headers) config.headers = {};
    if (!config.headers.Authorization) {
      if (localStorage.getItem('user-state')) {
        config.headers.Authorization = token
          ? 'Bearer ' + token
          : `Basic ${btoa(`${u}:${Decrypt(p)}`)}`;
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
