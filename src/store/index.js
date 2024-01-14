import { defineStore, createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

/**
 * @description pinia持久化参数配置
 * @param {String} key 存储到持久化的 name
 * @param {Array} paths 需要持久化的 state name
 * @return persist
 * */
const piniaPersistConfig = (key, paths) => {
  const persist = {
    key,
    storage: localStorage,
    // storage: sessionStorage,
    paths,
  };
  return persist;
};

export const GlobalStore = defineStore({
  id: 'globalState',
  state: () => ({
    radarToken: '',
    userInfo: undefined,
    wareHouse: [],
  }),
  getters: {},
  actions: {
    setGlobalState(state) {
      this.$patch(state);
    },
  },
  persist: piniaPersistConfig('GlobalState'),
});

// piniaPersist(持久化)
const store = createPinia();
store.use(piniaPluginPersistedstate);

export default store;
