import { defineStore } from 'pinia';
import { piniaPersistConfig } from '@/store';

export const useGlobalStore = defineStore('globalState', {
  state: () => ({
    systemTitle: '数字储运智慧监管平台',
    wareHouse: [],
    currentWareHouse: void 0,
    goodsType: [],
    houseType: [],
    radarCameraMap: [],
    wareHouseIdMapCameras: void 0,
    // 折叠菜单
    isCollapse: false,
    // 面包屑导航
    breadcrumb: true,
    // 当前页面是否全屏
    maximize: false,
  }),
  getters: {},
  actions: {
    setGlobalState(state) {
      this.$patch(state);
    },
  },
  persist: piniaPersistConfig('GlobalState'),
});
