<template>
  <ElConfigProvider :locale="zhCN">
    <Index />
  </ElConfigProvider>
</template>

<script setup>
import axios from 'axios';
import zhCN from 'element-plus/dist/locale/zh-cn.mjs';
import Index from './views/Index.vue';
import { useGlobalStore } from '@/store/global';

const globalStore = useGlobalStore();

const getStaticMap = async () => {
  const { data: { radarCameraMap = [], title: systemTitle } = {} } =
    await axios.get('/config.json');
  globalStore.setGlobalState({ radarCameraMap, systemTitle });
};

onMounted(() => {
  getStaticMap();
});
</script>

<style lang="less">
@import './assets/css/common.less';
</style>
