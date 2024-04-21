import request from '../request';

// 获取公司列表
export const getCompanyListApi = params => request.get('/api/v1/company', { params, data: params });

// 查询指定公司
export const getCompanyApi = id => request.get(`/api/v1/company/${id}`);

// 创建公司
export const createCompanyApi = data => request.post('/api/v1/company', data);

// 更新公司
export const updateCompanyApi = (id, data) => request.put(`/api/v1/company/${id}`, data);

// 删除公司
export const deleteCompanyApi = id => request.delete(`/api/v1/company/${id}`);

// 根据公司id获取公司下的所有用户
export const getCompanyUsersApi = id => request.get(`/api/v1/company/${id}/user`);

// 根据公司id添加用户到公司
export const addUserToCompanyApi = (id, data) => request.post(`/api/v1/company/${id}/user`, data);

// 根据公司id删除用户
export const deleteUserFromCompanyApi = (id, userIds) =>
  request.delete(`/api/v1/company/${id}/users`, {
    data: userIds,
  });

// 获取当前登录用户
export const getCurrentUserApi = () => request.get('/api/v1/current_user');

// 获取所有用户
export const getAllUsersApi = () => request.get('/api/v1/users');

// 获取指定用户
export const getUserApi = id => request.get(`/api/v1/users/${id}`);

// 创建用户
export const createUserApi = data => request.post('/api/v1/users', data);

// 更新用户
export const updateUserApi = (id, data) => request.put(`/api/v1/users/${id}`, data);

// 删除用户
export const deleteUserApi = id => request.delete(`/api/v1/users/${id}`);
