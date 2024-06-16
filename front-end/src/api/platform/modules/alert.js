import request from '../request';

// 获取告警列表
export const getAlertListApi = (params, data) =>
  request.post('/api/v1/alert_record_list', data, { params });

// 修改设备与仓库绑定关系
export const updateAlertApi = (id, data) => request.put(`/api/v1/alert_record/${id}`, data);

// 获取设备与仓库绑定关系
export const getAlertDetailApi = id => request.get(`/api/v1/alert_record/${id}`);
