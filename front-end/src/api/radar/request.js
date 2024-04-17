import axios from 'axios';
import dayjs from 'dayjs';
import { kexinLogin } from '@/utils/account';

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
    headers: localStorage.getItem('user-state')
      ? { Authorization: JSON.parse(localStorage.getItem('user-state')).radarToken }
      : {},
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
      if (data && data.code !== 200 && !(data instanceof Blob)) {
        if (data.code === 401) {
          const flag = await kexinLogin();
          if (flag) {
            location.reload();
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
        if (res.data && res.data.fileUpdateTime) {
          try {
            localStorage.setItem(key, JSON.stringify({ data: res.data }));
          } catch (error) {
            const keys = Object.keys(localStorage);
            const regex = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/;
            keys.forEach(key => {
              const match = key.match(regex);
              if (match) {
                const time = dayjs(match[0]);
                // 判断time是否是合法时间
                if (time.isValid()) {
                  // 判断time是否是7天前或者是2天前的不一定需要的大内存数据
                  if (
                    time.isBefore(dayjs().subtract(7, 'day')) ||
                    (!key.includes('findWarehouseGoodsPointCloudDataHistogram') &&
                      time.isBefore(dayjs().subtract(2, 'day')))
                  ) {
                    localStorage.removeItem(key);
                  }
                }
              }
            });
            try {
              localStorage.setItem(key, JSON.stringify({ data: res.data }));
            } catch (error) {
              console.error(error);
            }
          }
        }
        return res;
      })
      .catch(err => {
        return Promise.reject(err);
      });
  }
};

export default getInstance();
