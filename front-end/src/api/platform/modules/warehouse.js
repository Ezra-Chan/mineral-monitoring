import request from '../request';

// 获取仓库列表
export const getWarehouseListApi = (params, data) =>
  request.post('/api/v1/warehouselist', data, { params });

// 创建仓库
export const createWarehouseApi = data => request.post('/api/v1/warehouse', data);

// 更新仓库
export const updateWarehouseApi = (id, data) => request.put(`/api/v1/warehouse/${id}`, data);

// 删除仓库
export const deleteWarehouseApi = id => request.delete(`/api/v1/warehouse/${id}`);

// 获取仓库详情
export const getWarehouseDetailApi = id => request.get(`/api/v1/warehouse/${id}`);

// 同步仓库
export const syncWarehouseApi = data => request.post(`/api/v1/warehouse_sync`, data)
