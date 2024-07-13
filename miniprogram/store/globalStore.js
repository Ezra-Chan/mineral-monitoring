import { observable, autorun } from "mobx-miniprogram";

export const globalStore = observable({
  systemTitle: "数智储运管理平台",
  abbreviation: "数智储运",
  setStore(state) {
    Object.assign(this, state);
  },
});

// 恢复状态
const savedStore = wx.getStorageSync("globalStore");
if (savedStore) {
  globalStore.systemTitle = savedStore.systemTitle;
  globalStore.abbreviation = savedStore.abbreviation;
}

// 持久化逻辑
autorun(() => {
  wx.setStorageSync("globalStore", {
    systemTitle: globalStore.systemTitle,
    abbreviation: globalStore.abbreviation,
  });
});
