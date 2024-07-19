import Toast from "@vant/weapp/toast/toast";
import { authStore } from "../store/auth";

export const initDynamicRouter = async () => {
  try {
    // 1.获取菜单列表 && 按钮权限列表
    await authStore.getAuthPermission();
    // 2.判断当前用户有没有菜单权限
    if (!authStore.authMenuList.length) {
      Toast.fail({
        message: "当前账号无任何菜单权限，请联系系统管理员！",
        forbidClick: true,
        duration: 1500,
      });
      wx.reLaunch({ url: "/pages/login/login" });
      return Promise.reject("No permission");
    }
  } catch (error) {
    // 当按钮 || 菜单请求出错时，重定向到登录页
    wx.reLaunch({ url: "/pages/login/login" });
    return Promise.reject(error);
  }
};
