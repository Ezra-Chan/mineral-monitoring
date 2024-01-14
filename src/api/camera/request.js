import axios from 'axios';
// import { getToken } from 'utils/account';
import { GlobalStore } from '@/store';

let apiContextPath = '';
if (import.meta.env.DEV) {
  apiContextPath = '/api2';
} else {
  apiContextPath = 'http://root:Hhszcy%4012345@10.1.1.215';
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
    headers: localStorage.getItem('GlobalState')
      ? { Authorization: JSON.parse(localStorage.getItem('GlobalState')).cameraToken }
      : {},
  });

  instance.defaults.headers.post['Content-Type'] = 'application/json';

  instance.interceptors.response.use(
    async response => {
      let { data, request = {}, config = {} } = response;
      console.log({ response });
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
      console.error(error);
      if (error.response && error.response.status === 401) {
        axios
          .create({
            baseURL: `${apiContextPath}/${prefix ? prefix + '/' : ''}`,
            timeout: 60000,
            validateStatus: status => status >= 200 && status < 300,
            headers: {},
          })
          .get('/camera/list')
          .then(res => {
            console.log('res', res);
          })
          .catch(err => {
            console.log('err', err);
          });
        return;
      }
      return Promise.reject(error.response);
    },
  );
  return instance;
};

export default getInstance();
