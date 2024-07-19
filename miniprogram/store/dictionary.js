import { observable, autorun } from "mobx-miniprogram";
import { defaultPage } from "../utils/constant";
import { getDictionaryListApi } from "../api/platform/index";
import { userStore } from "./user";
import { updateDictEntry } from "../utils/func";

export const dictStore = observable({
  dict: void 0,
  setDict(value) {
    this.dict = value;
  },
  async getDictionary() {
    const { results = [] } = await getDictionaryListApi(defaultPage, {
      source: userStore.userInfo?.company_id,
    });
    const dict = {};
    results.forEach(({ key, value, name_en }) => {
      if (!dict[name_en]) dict[name_en] = { ORIGIN_ENUM: [] };
      updateDictEntry(dict, name_en, key, value);
      updateDictEntry(dict, name_en, value, key);
      dict[name_en].ORIGIN_ENUM.push({ label: value, value: key });
    });
    this.setDict(dict);
  },
});

// 恢复状态
const savedStore = wx.getStorageSync("dictStore");
if (savedStore) {
  dictStore.dict = savedStore.dict;
}

// 持久化逻辑
autorun(() => {
  wx.setStorageSync("dictStore", {
    dict: dictStore.dict,
  });
});
