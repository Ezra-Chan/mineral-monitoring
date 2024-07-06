import { defineStore } from 'pinia';
import { piniaPersistConfig } from '@/store';
import { getSystemSettingApi } from '@/api/platform';

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
    // 是否开启告警
    isAlert: true,
    // 告警方式
    alertType: ['email'],
    // 告警检查频次
    alertFrequency: 'EVERY_DAY_AT', // 每天
    // 告警时间
    alertTime: ['8AM', '8PM'],
  }),
  getters: {},
  actions: {
    setGlobalState(state) {
      this.$patch(state);
    },
    async getSystemConfigs() {
      const { data: { results = {} } = {} } = await getSystemSettingApi();
      results.alertType = results.alertType?.split(',');
      results.alertTime = results.alertTime?.split(',');
      results.isAlert = results.isAlert === '1';
      this.setGlobalState(results);
    },
  },
  persist: piniaPersistConfig('global-state'),
});
