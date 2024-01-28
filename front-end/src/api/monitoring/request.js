import axios from 'axios';

let apiContextPath = '';
if (import.meta.env.DEV) {
  apiContextPath = '/api3';
} else {
  apiContextPath = 'http://localhost:3000';
}

export const getInstance = (prefix = '') => {
  if (prefix) {
    prefix.startsWith('/') && (prefix = prefix.slice(1, prefix.length));
    prefix.endsWith('/') && (prefix = prefix.slice(0, -1));
  }
  const instance = axios.create({
    baseURL: `${apiContextPath}/${prefix ? prefix + '/' : ''}`,
    timeout: 60000,
    validateStatus: status => status >= 200 && status < 300,
    headers: {},
  });

  instance.defaults.headers.post['Content-Type'] = 'application/json';

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
      if (status !== 200 && !(data instanceof Blob)) {
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
