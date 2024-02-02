<template>
  <ElConfigProvider :locale="zhCN">
    <Index />
  </ElConfigProvider>
</template>

<script setup>
import axios from 'axios';
import videojs from 'video.js';
import zhCN from 'element-plus/dist/locale/zh-cn.mjs';
import Index from './views/Index.vue';
import { GlobalStore } from '@/store';

videojs.Vhs.xhr.beforeRequest = function (options) {
  const headers = options.headers || {};
  headers['Authorization'] = 'Basic cm9vdDpIaHN6Y3lAMTIzNDU=';
  console.log(headers);
  options.headers = headers;
  return options;
};

const globalStore = GlobalStore();
const title = useTitle();

const getStaticMap = async () => {
  const { data: { radarCameraMap = [], title: systemTitle } = {} } =
    await axios.get('/config.json');
  globalStore.setGlobalState({ radarCameraMap, systemTitle });
  title.value = systemTitle;
};

onMounted(() => {
  getStaticMap();
});
</script>

<style lang="less">
@import './assets/css/common.less';
</style>
