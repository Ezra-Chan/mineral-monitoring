import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import { piniaPersistConfig } from './index';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    refreshToken: '',
    tokenTime: void 0,
    userInfo: void 0,
    companyInfo: void 0, // 企业信息
    warehouses: [], // 有权限的仓库
    radarToken: '',
    radarUser: void 0,
    monitorInfo: void 0,
  }),
  getters: {},
  actions: {
    setToken(token, refreshToken) {
      if (token) {
        this.token = 'Bearer ' + token;
        refreshToken && (this.refreshToken = 'Bearer ' + refreshToken);
        this.tokenTime = dayjs().valueOf();
      } else {
        this.token = '';
        this.refreshToken = '';
        this.tokenTime = 0;
        this.userInfo = void 0;
        this.companyInfo = void 0;
        this.warehouses = void 0;
        this.radarToken = '';
        this.radarUser = void 0;
        this.monitorInfo = void 0;
      }
    },
    setRadarToken(token) {
      this.radarToken = token;
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    },
    setCompanyInfo(companyInfo) {
      this.companyInfo = companyInfo;
    },
    setWarehouses(warehouses) {
      this.warehouses = warehouses;
    },
    setRadarUser(radarUser) {
      this.radarUser = radarUser;
    },
    setMonitorInfo(monitorInfo) {
      this.monitorInfo = monitorInfo;
    },
  },
  persist: piniaPersistConfig('user-state'),
});
