// 可信仓后台管理接口
import dayjs from "dayjs";
import request from "./request";
// import request, { sendRequest } from "./request";

/**
 * 登录雷达系统
 * @param {object} params
 * @param {string} params.username 登录名
 * @param {string} params.password 密码
 * @returns
 */
export const getRadarToken = params => request.post("/admin/getToken", params);

/**
 * 获取仓库列表
 */
export const getWareHouseList = () =>
  request.post("/store/warehouse/list", {
    pageNum: 1,
    pageSize: 1000,
    warehouseStatus: "302",
  });

// 获取货仓详细信息
export const getWareHouseDetail = (id, timestamp = "") =>
  request.post("/store/warehouse/findDetailByTime", { id, timestamp });

// 堆形图、点云图
export const getCloudPointData = (type, id, timestamp) => {
  if (
    !timestamp ||
    dayjs(timestamp).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")
  ) {
    return request.post(`/store/newRadar/${type}`, {
      id,
      timestamp: timestamp || "",
    });
  } else {
    return sendRequest(
      `/store/newRadar/${type}`,
      { id, timestamp: timestamp || "" },
      { method: "POST" }
    );
  }
};

// 堆形图 用来获取不同时间的数据
export const getDataByTime = (id, timestamp) => {
  if (
    !timestamp ||
    dayjs(timestamp).format("YYYY-MM-DD") === dayjs().format("YYYY-MM-DD")
  ) {
    const params = { id };
    timestamp && (params.timestamp = timestamp);
    return request.post(
      "/store/newRadar/findWarehouseGoodsPointCloudHistogram",
      params
    );
  } else {
    return sendRequest(
      "/store/newRadar/findWarehouseGoodsPointCloudHistogram",
      { id, timestamp },
      { method: "POST" }
    );
  }
};

// 获取字典
export const getDict = () =>
  request.get("/store/enums/list?name=FoodstuffTypeEnum,HouseTypeEnum");

// 获取仓库绑定的设备信息
export const getDevicesByWarehouseId = id =>
  request.post("/store/api/getWarehouseEquipmentsInfo", {
    warehouseId: id,
  });

// 获取设备连接状态
export const getDeviceConnectStatus = id =>
  request.post("/store/api/getEquipmentConnectStatus", { devId: id });

// 获取仓库定时扫描计划
export const getWarehouseScanPlan = id =>
  request.post("/store/api/getRadarPlan", { warehouseId: id });

/**
 * 修改仓库定时扫描计划
 * @param {object} params
 * @param {number} params.warehouseId 仓库id
 * @param {number} params.startTimeSpan 扫描周期 单位：分钟；传 null 则取消定时扫描计划
 * @param {number} params.noScanTimeStart 非扫描时间起始 单位：小时； 传 null 不设置
 * @param {number} params.noScanTimeEnd 非扫描时间结束 单位：小时；传 null 不设置
 * @param {Date} params.radarFirstRunTime 雷达首次运行时间 不可早于当前时间；传 null 不设置
 * @returns
 */
export const updateWarehouseScanPlan = params =>
  request.post("/store/api/updateRadarPlan", params);
