// 可信仓后台管理接口
import request from '../request';

/**
 * 登录雷达系统
 * @param {object} params
 * @param {string} params.username 登录名
 * @param {string} params.password 密码
 * @returns
 */
export const radarToken = params => request.post('admin/getToken', params);
export const radarLogin = params => request.post('admin/login', params);

/**
 * 获取用户信息
 * @returns
 */
export const getUserInfo = () => request.get('admin/info');

/**
 * 获取仓库列表
 */
export const getWareHouseList = () =>
  request.post('store/warehouse/list', {
    pageNum: 1,
    pageSize: 1000,
    warehouseStatus: '302',
  });
