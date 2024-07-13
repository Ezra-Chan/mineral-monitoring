import Toast from "@vant/weapp/toast/toast";
import { Decrypt } from "./AES";
import { encrypt } from "./rsa";
import { getRadarToken } from "../api/radar/index";
import { userStore } from "../store/userStore";

let isPending = false;
let kexinPending = false;

// 登录可信仓
export const kexinLogin = async () => {
  try {
    if (!kexinPending) {
      kexinPending = true;
      const { radarUser } = wx.getStorageSync("userStore") || {};
      if (radarUser) {
        const radarUserInfo = {
          username: radarUser.u,
          password: Decrypt(radarUser.p),
        };
        const { data = {} } = await getRadarToken(radarUserInfo);
        const { tokenHead, token } = data;
        userStore.setStore({
          radarToken: tokenHead + token,
        });
        kexinPending = false;
        return true;
      }
    }
    return false;
  } catch (e) {
    kexinPending = false;
    if (error?.data?.code === 500) {
      Toast.fail(error.data.message);
      throw new Error(error.data.message);
    }
    throw new Error(error);
  } finally {
    const timer = setTimeout(() => {
      kexinPending = false;
      clearTimeout(timer);
    }, 2000);
  }
};

export const getToken = async (params = {}, flag) => {
  const { userInfo, token } = wx.getStorageSync("userStore") || {};
  if (!userInfo) {
    return wx.reLaunch({ url: "/pages/login/login" });
  }
};
