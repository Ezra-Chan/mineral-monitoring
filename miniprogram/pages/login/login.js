// pages/login/login.js
import Toast from "@vant/weapp/toast/toast";
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { globalStore } from "../../store/global";
import { monitoringLogin } from "../../utils/account";
import { initSystem } from "../../utils/init";
import { Encrypt } from "../../utils/AES";
import { initDynamicRouter } from "../../utils/router";

Page({
  data: {
    username: "",
    password: "",
  },
  onLoad() {
    wx.hideHomeButton();
    this.storeBindings = createStoreBindings(this, {
      store: globalStore,
      fields: ["systemTitle"],
    });
  },
  async login() {
    if (!this.data.username || !this.data.password) {
      return Toast.fail("请输入账号和密码");
    }
    try {
      Toast.loading({
        duration: 0,
        message: "登录中...",
        forbidClick: true,
      });
      await monitoringLogin({
        username: this.data.username,
        password: Encrypt(this.data.password),
      });
      const flag = await initSystem();
      if (flag !== false) {
        await initDynamicRouter();
        Toast.success({
          message: "登录成功",
          duration: 1500,
          onClose: () => wx.reLaunch({ url: "/pages/home/home" }),
        });
      }
    } catch (error) {
      console.error("登录失败", error);
      return Toast.fail("登录失败");
    }
  },
});
