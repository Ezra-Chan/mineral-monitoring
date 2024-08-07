import request from '../request';

// 获取系统配置
export const getSystemSettingApi = () => request.get('/api/v1/allConfig');

// 修改系统配置
export const updateSystemSettingApi = (params, needReload = 0) =>
  request.post(`/api/v1/update_config?needReload=${needReload}`, params);
