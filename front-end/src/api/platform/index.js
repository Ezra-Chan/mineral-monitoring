import request from './request';

// 获取菜单列表
export const getAuthMenuListApi = () => request.get('/menu/list');
