import { observable, autorun } from "mobx-miniprogram";
import { getNonFuncProperties } from "../utils/func";

export const globalStore = observable({
  systemTitle: "数智储运管理平台",
  abbreviation: "数智储运",
  setStore(state) {
    Object.assign(this, state);
  },
});

const nonFuncProperties = getNonFuncProperties(globalStore);

// 恢复状态
const savedStore = wx.getStorageSync("globalStore");
if (savedStore) {
  nonFuncProperties.forEach(p => {
    globalStore[p] = savedStore[p];
  });
}

// 持久化逻辑
autorun(() => {
  const obj = {};
  nonFuncProperties.forEach(p => {
    obj[p] = globalStore[p];
  });
  wx.setStorageSync("globalStore", obj);
});
