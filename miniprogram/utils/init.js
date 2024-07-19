import Toast from "@vant/weapp/toast/toast";
import { getCurrentUser, isAdmin } from "./account";
import { getWarehouseList } from "./warehouse";
import { defaultPage } from "./constant";
import { dictStore } from "../store/dictionary";
import { userStore } from "../store/user";

export const initSystem = async () => {
  await getCurrentUser();
  if (isAdmin()) {
    userStore.setToken();
    Toast.fail("超级管理员无法登录");
    return false;
  }
  dictStore.getDictionary();
  const { results = [] } = await getWarehouseList(defaultPage);
  userStore.setStore({ warehouses: results });
};
