import { observable, autorun } from "mobx-miniprogram";

export const userStore = observable({
  token: "",
  refreshToken: "",
  tokenTime: void 0,
  userInfo: void 0,
  companyInfo: void 0, // 企业信息
  warehouses: [], // 有权限的仓库
  radarToken: "",
  radarUser: void 0,
  monitorUser: void 0,
  setToken(token, refreshToken) {
    console.log("setToken", new Date());
  },
  setStore(state) {
    Object.assign(this, state);
  },
});

// 恢复状态
const savedStore = wx.getStorageSync("userStore");
if (savedStore) {
  userStore.systemTitle = savedStore.systemTitle;
  userStore.abbreviation = savedStore.abbreviation;
}

// 持久化逻辑
autorun(() => {
  wx.setStorageSync("userStore", {
    systemTitle: userStore.systemTitle,
    abbreviation: userStore.abbreviation,
  });
});
