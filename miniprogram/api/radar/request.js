import { kexinApi } from "../../utils/constant";
import { kexinLogin } from "../../utils/account";
const prefix = "/shmanage";

const request = (url, data, method = "GET", myHeader = {}) => {
  return new Promise((resolve, reject) => {
    const { companyInfo = {}, radarToken } =
      wx.getStorageSync("userInfo") || {};

    const header = radarToken
      ? {
          "content-type": "application/json",
          Authorization: radarToken,
          ...myHeader,
        }
      : {
          "content-type": "application/json",
          ...myHeader,
        };
    wx.request({
      url: (companyInfo.kexin_ip || kexinApi) + prefix + url,
      method,
      data,
      header,
      success: async res => {
        const { data = {} } = res;
        const { code } = data;
        if (code === 401) {
          const flag = await kexinLogin();
          // flag && wx.reLaunch({ url: "home/home" });
        } else if (code < 200 || code >= 300) {
          reject(res);
        } else {
          resolve(data);
        }
      },
      fail: err => {
        console.error("error", err);
        reject(err);
      },
    });
  });
};

module.exports = {
  get: (url, data, header) => request(url, data, "GET", header),
  post: (url, data, header) => request(url, data, "POST", header),
};
