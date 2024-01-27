// 可信仓后台管理接口
import request from './request';

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

// 获取货仓详细信息
export const getWareHouseDetail = (id, timestamp = '') =>
  request.post('/store/warehouse/findDetailByTime', { id, timestamp });

// 堆形图、点云图
export const getCloudPointData = (type, id, timestamp) =>
  request.post(`/store/newRadar/${type}`, { id, timestamp: timestamp || '' });

// 堆形图 用来获取不同时间的数据
export const getDataByTime = (id, timestamp) =>
  request.post('/store/newRadar/findWarehouseGoodsPointCloudDataHistogram', { id, timestamp });

// 获取字典
export const getDict = () => request.get('/store/enums/list?name=FoodstuffTypeEnum,HouseTypeEnum');
