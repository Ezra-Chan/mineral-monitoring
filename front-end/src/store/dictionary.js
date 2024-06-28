import { defineStore } from 'pinia';
import { piniaPersistConfig } from './index';
import { getDictionaryListApi } from '@/api/platform';
import { defaultPage } from '@/utils/constant';
import { useUserStore } from '@/store/user';

const updateDictEntry = (dict, name, entryKey, entryValue) => {
  const existingEntry = dict[name][entryKey];
  if (existingEntry === undefined) {
    dict[name][entryKey] = entryValue;
  } else if (Array.isArray(existingEntry)) {
    existingEntry.push(entryValue);
  } else {
    dict[name][entryKey] = [existingEntry, entryValue];
  }
  // 如果dict[name][entryKey]是数组，需要去重
  if (Array.isArray(dict[name][entryKey])) {
    dict[name][entryKey] = [...new Set(dict[name][entryKey])];
    // 如果dict[name][entryKey]长度为1，则将其转换为字符串
    if (dict[name][entryKey].length === 1) {
      dict[name][entryKey] = dict[name][entryKey][0];
    }
  }
};

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
      data.results.forEach(({ key, value, name_en }) => {
        if (!dict[name_en]) dict[name_en] = { ORIGIN_ENUM: [] };
        updateDictEntry(dict, name_en, key, value);
        updateDictEntry(dict, name_en, value, key);
        dict[name_en].ORIGIN_ENUM.push({ label: value, value: key });
      });
      this.setDict(dict);
    },
  },
  persist: piniaPersistConfig('dictionary-state'),
});
