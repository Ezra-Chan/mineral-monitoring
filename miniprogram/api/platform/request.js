import { getToken } from "../../utils/account";
import { platformIp } from "../../utils/constant";

const request = (url, data, method = "GET", myHeader = {}) => {
  return new Promise((resolve, reject) => {
    const { token } = wx.getStorageSync("userStore") || {};

    const header = token
      ? {
          "content-type": "application/json",
          Authorization: token,
          ...myHeader,
        }
      : {
          "content-type": "application/json",
          ...myHeader,
        };
    wx.request({
      url: platformIp + url,
      method,
      data,
      header,
      success: async res => {
        const { data, statusCode } = res;
        if (statusCode < 200 || statusCode >= 300) {
          if (statusCode === 401) {
            return;
          }
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
  put: (url, data, header) => request(url, data, "PUT", header),
  delete: (url, header) => request(url, void 0, "DELETE", header),
};
