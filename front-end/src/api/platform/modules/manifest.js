import request from '../request';

// 获取货单列表
export const getMenifestListApi = (params, data) =>
  request.post('/api/v1/goods_record_list', data, { params });

// 创建货单
export const createMenifestApi = data => request.post('/api/v1/goods_record', data);

// 删除货单
export const deleteMenifestApi = id => request.delete(`/api/v1/goods_record/${id}`);

// 更新货单
export const updateMenifestApi = (id, data) => request.put(`/api/v1/goods_record/${id}`, data);

// 获取货单详情
export const getMenifestApi = id => request.get(`/api/v1/goods_record/${id}`);
