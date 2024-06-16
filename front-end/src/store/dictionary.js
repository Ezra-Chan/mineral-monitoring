import { defineStore } from 'pinia';
import { piniaPersistConfig } from './index';
import { getDictionaryListApi } from '@/api/platform';
import { getWarehouseList } from '@/utils/warehouse';
import { defaultPage } from '@/utils/constant';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();

export const useDictStore = defineStore('dictionary', {
  state: () => ({
    warehouse: void 0,
    company: void 0,
    dict: void 0,
  }),
  getters: {},
  actions: {
    setDict(value) {
      this.dict = value;
    },
    setWarehouse(value) {
      this.warehouse = value;
    },
    setCompany(value) {
      this.company = value;
    },
    async getWarehouse() {
      const { data = {} } = await getWarehouseList(defaultPage);
      const warehouse = {};
      data.results.forEach(item => {
        warehouse[item.name] = item.erp_name;
        warehouse[item.erp_name] = item.name;
      });
      this.setWarehouse(warehouse);
    },
    async getCompanyDict() {
      if (userStore.companyInfo) {
        const { erp_name, name } = userStore.companyInfo;
        this.setCompany({
          [erp_name]: name,
          [name]: erp_name,
        });
      }
    },
    async getDictionary() {
      const { data = {} } = await getDictionaryListApi(defaultPage, {
        source: userStore.userInfo.company_id,
      });
      const dict = {};
      data.results.forEach(item => {
        const { key, value, name_en } = item;
        if (!dict[name_en]) dict[name_en] = {};
        dict[name_en][key] = value;
        dict[name_en][value] = key;
      });
      this.setDict(dict);
    },
    getAllDictionary() {
      this.getWarehouse();
      this.getCompanyDict();
      this.getDictionary();
    },
  },
  persist: piniaPersistConfig('dictionary-state'),
});
