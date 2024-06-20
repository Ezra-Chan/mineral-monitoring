import { defineStore } from 'pinia';
import { piniaPersistConfig } from './index';
import { getDictionaryListApi } from '@/api/platform';
import { defaultPage } from '@/utils/constant';
import { useUserStore } from '@/store/user';

export const useDictStore = defineStore('dictionary', {
  state: () => ({
    dict: void 0,
  }),
  getters: {},
  actions: {
    setDict(value) {
      this.dict = value;
    },
    async getDictionary() {
      const userStore = useUserStore();
      const { data = {} } = await getDictionaryListApi(defaultPage, {
        source: userStore.userInfo.company_id,
      });
      const dict = {};
      data.results.forEach(item => {
        const { key, value, name_en } = item;
        if (!dict[name_en]) dict[name_en] = { ORIGIN_ENUM: [] };
        dict[name_en][key] = value;
        dict[name_en][value] = key;
        dict[name_en].ORIGIN_ENUM.push({
          label: value,
          value: key,
        });
      });
      this.setDict(dict);
    },
  },
  persist: piniaPersistConfig('dictionary-state'),
});
