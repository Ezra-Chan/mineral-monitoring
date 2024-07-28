// pages/profile/profile.js
import { createStoreBindings } from "mobx-miniprogram-bindings";
import { userStore } from "../../store/user";
import { defaultAvatarUrl } from "../../utils/constant";

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  async onChooseAvatar(e) {
    const { avatarUrl } = e.detail;
    console.log("avatarUrl", avatarUrl);
    const base64 = await new Promise(resolve => {
      //获取全局唯一的文件管理器
      wx.getFileSystemManager().readFile({
        //读取本地文件内容
        filePath: avatarUrl, // 文件路径
        encoding: "base64", // 返回格式
        success: ({ data }) => resolve("data:image/png;base64," + data),
        fail(res) {
          console.log("fail", res);
        },
      });
    });
  },

  async logout() {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.storeBindings = createStoreBindings(this, {
      store: userStore,
      fields: ["userInfo", "userAvatar"],
    });
  },
});
