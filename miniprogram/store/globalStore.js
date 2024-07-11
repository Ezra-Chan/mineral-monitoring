import { observable, autorun } from "mobx-miniprogram";

export const globalStore = observable({
  systemTitle: "数智储运管理平台",
  abbreviation: "数智储运",
  activeTab: "home",
  setGlobalStore(state) {
    Object.assign(this, state);
  },
});

// 持久化逻辑
autorun(() => {
  wx.setStorageSync("globalStore", {
    systemTitle: globalStore.systemTitle,
    abbreviation: globalStore.abbreviation,
  });
});

// 恢复状态
const savedGlobalStore = wx.getStorageSync("globalStore");
if (savedGlobalStore) {
  globalStore.systemTitle = savedGlobalStore.systemTitle;
  globalStore.abbreviation = savedGlobalStore.abbreviation;
}
