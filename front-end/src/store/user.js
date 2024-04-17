import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import { piniaPersistConfig } from './index';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    refreshToken: '',
    tokenTime: void 0,
    userInfo: void 0,
    radarToken: '',
    radarUser: void 0,
  }),
  getters: {},
  actions: {
    setToken(token, refreshToken) {
      this.token = token;
      if (token) {
        refreshToken && (this.refreshToken = refreshToken);
        this.tokenTime = dayjs().valueOf();
      } else {
        this.refreshToken = '';
        this.tokenTime = 0;
        this.radarToken = '';
      }
    },
    setRadarToken(token) {
      this.radarToken = token;
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    },
    setRadarUser(radarUser) {
      this.radarUser = radarUser;
    },
  },
  persist: piniaPersistConfig('user-state'),
});
