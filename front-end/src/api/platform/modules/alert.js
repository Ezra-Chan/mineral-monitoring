import request from '../request';

// 获取告警列表
export const getAlertListApi = (params, data) =>
  request.post('/api/v1/alert_record_list', data, { params });

// 已读告警
export const readAlertApi = (id, remark) =>
  request.post(`/api/v1/handle_alert`, {
    id,
    remark,
  });
