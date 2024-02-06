import axios from 'axios';
import { getToken } from 'utils/account';
import { GlobalStore } from '@/store';

let apiContextPath = '';
if (import.meta.env.DEV) {
  apiContextPath = '/api1';
} else {
  apiContextPath = 'https://app.or-intech.com';
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
    headers: localStorage.getItem('GlobalState')
      ? { Authorization: JSON.parse(localStorage.getItem('GlobalState')).radarToken }
      : {},
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
          const globalStore = GlobalStore();
          if (globalStore?.userInfo) {
            const { username, password } = globalStore.userInfo;
            const flag = await getToken({ username, password });
            if (flag) {
              location.href = '/';
            }
          } else {
            location.href = '/#/login';
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

export const sendRequest = (url, params = {}, options = {}) => {
  const key = url + JSON.stringify(params);
  if (localStorage.getItem(key)) {
    return Promise.resolve(JSON.parse(localStorage.getItem(key)));
  } else {
    return getInstance()
      [options.method.toLowerCase()](url, params, options)
      .then(res => {
        localStorage.setItem(key, JSON.stringify({ data: res.data }));
        return res;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }
};

export default getInstance();
