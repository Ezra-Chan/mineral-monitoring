import request from '../request';

// 获取字典列表
export const getDictionaryListApi = (params, data) =>
  request.post('/api/v1/dictlist', data, { params });

// 创建字典
export const createDictionaryApi = data => request.post('/api/v1/dict', data);

// 删除字典
export const deleteDictionaryApi = id => request.delete(`/api/v1/dict/${id}`);

// 更新字典
export const updateDictionaryApi = (id, data) => request.put(`/api/v1/dict/${id}`, data);

// 获取字典详情
export const getDictionaryApi = id => request.get(`/api/v1/dict/${id}`);
