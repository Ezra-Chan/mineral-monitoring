import { defineStore } from 'pinia';
import { piniaPersistConfig } from '@/store';

export const useGlobalStore = defineStore('globalState', {
  state: () => ({
    systemTitle: '数智储运管理平台',
    abbreviation: '数智储运',
    currentWareHouse: void 0,
    // 折叠菜单
    isCollapse: false,
    // 面包屑导航
    breadcrumb: true,
    // 当前页面是否全屏
    maximize: false,
    // 暗黑模式
    isDark: false,
    inventory: {},
  }),
  getters: {},
  actions: {
    setGlobalState(state) {
      this.$patch(state);
    },
  },
  persist: piniaPersistConfig('global-state'),
});
