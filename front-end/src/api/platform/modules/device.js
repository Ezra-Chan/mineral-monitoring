import request from '../request';

// 获取设备列表
export const getDeviceList = (params, data) => request.post('/api/v1/devicelist', data, { params });

// 添加设备与仓库绑定关系
export const addDevice = data => request.post('/api/v1/device', data);

// 删除设备与仓库绑定关系
export const deleteDevice = id => request.delete(`/api/v1/device/${id}`);

// 修改设备与仓库绑定关系
export const updateDevice = (id, data) => request.put(`/api/v1/device/${id}`, data);

// 获取设备与仓库绑定关系
export const getDeviceDetail = id => request.get(`/api/v1/device/${id}`);
