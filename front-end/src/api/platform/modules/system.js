import request from '../request';

// 获取系统配置
export const getSystemSettingApi = params => request.post('/api/v1/get_system', params);

// 修改系统配置
export const updateSystemSettingApi = params => request.post('/api/v1/update_system', params);
