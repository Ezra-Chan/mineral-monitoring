import request from '../request';

// 登录
export const loginApi = params => request.post('/auth/login', params);

// 刷新token
export const refreshTokenApi = () =>
  request.post(
    '/auth/refresh',
    {},
    {
      headers: {
        Authorization: JSON.parse(localStorage.getItem('user-state'))?.refreshToken,
      },
    },
  );

// 删除token
export const revokeAccessApi = params => request.delete('/auth/revoke_access', params);

// 删除refresh_token
export const revokeRefreshApi = () =>
  request.delete('/auth/revoke_refresh', {
    headers: {
      Authorization: JSON.parse(localStorage.getItem('user-state'))?.refreshToken,
    },
  });

// 获取菜单列表
export const getAuthMenuListApi = () =>
  request.get('/menu/list', {
    baseURL: '/api5',
  });

// 获取按钮权限
export const getAuthButtonListApi = () =>
  request.get('/auth/buttons', {
    baseURL: '/api5',
  });
