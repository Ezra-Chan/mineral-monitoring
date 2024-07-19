// app.js
import { getToken } from "./utils/account";
import { getSystemSettingApi } from "./api/platform/index";
import { globalStore } from "./store/global";

App({
  async onLaunch() {
    console.log("App Launch");
    try {
      const { results = {} } = await getSystemSettingApi();
      const { systemTitle, abbreviation } = results;
      globalStore.setStore({
        systemTitle,
        abbreviation,
      });
      await getToken();
    } catch (error) {
      console.error(error);
      wx.reLaunch({ url: "/pages/login/login" });
    }
  },
});
