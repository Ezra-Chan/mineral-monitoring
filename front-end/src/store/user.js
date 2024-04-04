import { defineStore } from 'pinia';
import dayjs from 'dayjs';
import { piniaPersistConfig } from './index';

export const useUserStore = defineStore('user', {
  state: () => ({
    radarToken: '',
    radarTokenTime: void 0,
    userInfo: void 0,
  }),
  getters: {},
  actions: {
    setToken(token) {
      this.radarToken = token;
      this.radarTokenTime = token ? dayjs().valueOf() : 0;
    },
    setUserInfo(userInfo) {
      this.userInfo = userInfo;
    },
  },
  persist: piniaPersistConfig('user-state'),
});
