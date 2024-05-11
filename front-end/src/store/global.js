import { defineStore } from 'pinia';
import { piniaPersistConfig } from '@/store';

export const useGlobalStore = defineStore('globalState', {
  state: () => ({
    systemTitle: '数智储运管理平台',
    abbreviation: '数智储运',
    cameraIp: 'http://10.1.1.215',
    wareHouse: [],
    currentWareHouse: void 0,
    goodsType: [],
    houseType: [],
    // 折叠菜单
    isCollapse: false,
    // 面包屑导航
    breadcrumb: true,
    // 当前页面是否全屏
    maximize: false,
    // 暗黑模式
    isDark: false,
  }),
  getters: {},
  actions: {
    setGlobalState(state) {
      this.$patch(state);
    },
  },
  persist: piniaPersistConfig('GlobalState'),
});
