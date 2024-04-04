import { defineStore } from 'pinia';
import router from '@/router';
import { piniaPersistConfig } from '@/store';

export const useTabsStore = defineStore('tabs', {
  state: () => ({
    tabsMenuList: [],
  }),
  actions: {
    async addTabs(tabItem) {
      if (this.tabsMenuList.every(item => item.path !== tabItem.path)) {
        this.tabsMenuList.push(tabItem);
      }
    },
    async removeTabs(tabPath, isCurrent = true) {
      const tabsMenuList = this.tabsMenuList;
      if (isCurrent) {
        tabsMenuList.forEach((item, index) => {
          if (item.path !== tabPath) return;
          const nextTab = tabsMenuList[index + 1] || tabsMenuList[index - 1];
          if (!nextTab) return;
          router.push(nextTab.path);
        });
      }
      this.tabsMenuList = tabsMenuList.filter(item => item.path !== tabPath);
    },
    async closeMultipleTab(tabsMenuValue) {
      this.tabsMenuList = this.tabsMenuList.filter(item => {
        return item.path === tabsMenuValue || !item.close;
      });
    },
    async setTabs(tabsMenuList) {
      this.tabsMenuList = tabsMenuList;
    },
    async setTabsTitle(title) {
      const nowFullPath = location.hash.substring(1);
      this.tabsMenuList.forEach(item => {
        if (item.path === nowFullPath) item.title = title;
      });
    },
  },
  persist: piniaPersistConfig('open-tabs'),
});
