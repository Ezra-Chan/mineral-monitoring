import axios from 'axios';
// import { getToken } from 'utils/account';
import { GlobalStore } from '@/store';

let apiContextPath = '';
if (import.meta.env.DEV) {
  apiContextPath = '/api2';
} else {
  apiContextPath = 'http://10.1.1.215';
}

export const getInstance = prefix => {
  if (prefix) {
    prefix.startsWith('/') && (prefix = prefix.slice(1, prefix.length));
    prefix.endsWith('/') && (prefix = prefix.slice(0, -1));
  }
  const instance = axios.create({
    baseURL: `${apiContextPath}/${prefix ? prefix + '/' : ''}`,
    timeout: 60000,
    validateStatus: status => status >= 200 && status < 300,
    headers: { Authorization: 'Basic cm9vdDpIaHN6Y3lAMTIzNDU=' },
  });

  instance.defaults.headers.post['Content-Type'] = 'application/json';

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
