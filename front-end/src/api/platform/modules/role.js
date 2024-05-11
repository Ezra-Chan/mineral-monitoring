import request from '../request';
import { defaultPage } from '@/utils/constant';

// 获取角色列表
export const getRoleListApi = () =>
  request.post(
    '/api/v1/rolelist',
    {},
    {
      params: defaultPage,
    },
  );

// 创建角色
export const createRoleApi = data => request.post('/api/v1/role', data);

// 删除角色
export const deleteRoleApi = id => request.delete(`/api/v1/role/${id}`);

// 更新角色
export const updateRoleApi = (id, data) => request.put(`/api/v1/role/${id}`, data);

// 获取角色详情
export const getRoleApi = id => request.get(`/api/v1/role/${id}`);
