import request from '../request';

// 获取货单列表
export const getInventoryListApi = (params, data) =>
  request.post('/api/v1/inventorylist', data, { params });
