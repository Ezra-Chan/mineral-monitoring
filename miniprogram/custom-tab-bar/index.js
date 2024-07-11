import { storeBindingsBehavior } from "mobx-miniprogram-bindings";
import { globalStore } from "../store/globalStore.js";

Component({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store: globalStore,
    fields: ["activeTab"],
    actions: ["setGlobalStore"],
  },
  data: {
    list: [
      {
        pagePath: "/pages/home/home",
        text: "首页",
        name: "home",
        iconPath: "bar-chart-o",
      },
      {
        pagePath: "/pages/warehouse/warehouse",
        text: "仓库",
        name: "warehouse",
        iconPath: "home-o",
      },
      {
        pagePath: "/pages/device/device",
        text: "设备",
        name: "device",
        iconPath: "desktop-o",
      },
      {
        pagePath: "/pages/inventory/inventory",
        text: "盘点",
        name: "inventory",
        iconPath: "scan",
      },
      {
        pagePath: "/pages/profile/profile",
        text: "我的",
        name: "profile",
        iconPath: "contact-o",
      },
    ],
  },
  methods: {
    onChange(event) {
      this.setGlobalStore({ activeTab: event.detail });
    },
  },
});
