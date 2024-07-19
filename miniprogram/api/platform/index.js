import qs from "querystringify";
import request from "./request";

// 登录
export const loginApi = params => request.post("/auth/login", params);

// 刷新token
export const refreshTokenApi = () =>
  request.post(
    "/auth/refresh",
    {},
    {
      Authorization: wx.getStorageSync("userInfo")?.refreshToken,
    }
  );

// 删除token
export const revokeAccessApi = () => request.delete("/auth/revoke_access");

// 删除refresh_token
export const revokeRefreshApi = () =>
  request.delete("/auth/revoke_refresh", {
    Authorization: wx.getStorageSync("userInfo")?.refreshToken,
  });

// 获取系统配置
export const getSystemSettingApi = () => request.get("/api/v1/allConfig");

// 获取当前登录用户
export const getCurrentUserApi = () => request.get("/api/v1/current_user");

// 获取字典列表
export const getDictionaryListApi = (params, data) =>
  request.post("/api/v1/dictlist?" + qs.stringify(params), data);

// 获取仓库列表
export const getWarehouseListApi = (params, data) =>
  request.post("/api/v1/warehouselist?" + qs.stringify(params), data);

// 获取角色详情
export const getRoleApi = id => request.get(`/api/v1/role/${id}`);
