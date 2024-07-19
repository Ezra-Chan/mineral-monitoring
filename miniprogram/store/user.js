import { observable, autorun } from "mobx-miniprogram";
import dayjs from "dayjs";
import { getNonFuncProperties } from "../utils/func";

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
    if (token) {
      this.token = "Bearer " + token;
      refreshToken && (this.refreshToken = "Bearer " + refreshToken);
      this.tokenTime = dayjs().valueOf();
    } else {
      this.token = "";
      this.refreshToken = "";
      this.tokenTime = 0;
      this.userInfo = void 0;
      this.companyInfo = void 0;
      this.warehouses = void 0;
      this.radarToken = "";
      this.radarUser = void 0;
      this.monitorUser = void 0;
    }
  },
  setStore(state) {
    Object.assign(this, state);
  },
});

const nonFuncProperties = getNonFuncProperties(userStore);

// 恢复状态
const savedStore = wx.getStorageSync("userStore");
if (savedStore) {
  nonFuncProperties.forEach(p => {
    userStore[p] = savedStore[p];
  });
}

// 持久化逻辑
autorun(() => {
  const obj = {};
  nonFuncProperties.forEach(p => {
    obj[p] = userStore[p];
  });
  wx.setStorageSync("userStore", obj);
});
