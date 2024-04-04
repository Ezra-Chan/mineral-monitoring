import { defineStore } from 'pinia';

export const useKeepAliveStore = defineStore('keepAlive', {
  state: () => ({
    keepAliveName: [],
  }),
  actions: {
    async addKeepAliveName(name) {
      !this.keepAliveName.includes(name) && this.keepAliveName.push(name);
    },
    async removeKeepAliveName(name) {
      this.keepAliveName = this.keepAliveName.filter(item => item !== name);
    },
    async setKeepAliveName(keepAliveName = []) {
      this.keepAliveName = keepAliveName;
    },
  },
});
