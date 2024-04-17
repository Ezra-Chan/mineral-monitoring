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
import { useUserStore } from '@/store/user';

const globalStore = useGlobalStore();
const userStore = useUserStore();

const getStaticMap = async () => {
  const {
    data: { radarCameraMap = [], title: systemTitle, cameraIp, abbreviation, radarUser } = {},
  } = await axios.get('/config.json');
  globalStore.setGlobalState({ radarCameraMap, systemTitle, cameraIp, abbreviation });
  userStore.setRadarUser(radarUser);
};

onMounted(() => {
  getStaticMap();
});
</script>

<style lang="less">
@import '@/assets/css/common.less';
</style>
