import { observable, autorun } from "mobx-miniprogram";
import { getRoleApi } from "../api/platform/index";
import { getCurrentUser } from "../utils/account";
import { userStore } from "../store/user";
import {
  getNonFuncProperties,
  formatMenuAndButton,
  getFlatMenuList,
} from "../utils/func";

export const authStore = observable({
  // 按钮权限列表
  authButtonList: {},
  // 菜单权限列表
  authMenuList: [],
  // 当前页面的 router name，用来做按钮权限筛选
  routeName: "",
  get flatMenuListGet() {
    return getFlatMenuList(this.authMenuList);
  },
  setStore(state) {
    Object.assign(this, state);
  },
  async getAuthPermission() {
    if (!userStore.userInfo?.role_id) {
      await getCurrentUser();
    }
    const { role = {} } = await getRoleApi(userStore.userInfo?.role_id);
    const { menus, buttons } = formatMenuAndButton(
      JSON.parse(role.permissions || "[]")
    );
    this.authButtonList = buttons;
    this.authMenuList = menus;
  },
});

const nonFuncProperties = getNonFuncProperties(authStore);

// 恢复状态
const savedStore = wx.getStorageSync("authStore");
if (savedStore) {
  nonFuncProperties.forEach(p => {
    authStore[p] = savedStore[p];
  });
}

// 持久化逻辑
autorun(() => {
  const obj = {};
  nonFuncProperties.forEach(p => {
    obj[p] = authStore[p];
  });
  wx.setStorageSync("authStore", obj);
});
