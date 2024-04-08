import request from '../request';

// 获取菜单列表
export const getAuthMenuListApi = () => request.get('/menu/list');

// 获取按钮权限
export const getAuthButtonListApi = () => request.get('/auth/buttons');
