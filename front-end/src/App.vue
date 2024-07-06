<template>
  <ElConfigProvider :locale="zhCN">
    <Index />
  </ElConfigProvider>
</template>

<script setup>
import zhCN from 'element-plus/dist/locale/zh-cn.mjs';
import Index from './views/Index.vue';
import { useGlobalStore } from '@/store/global';

const globalStore = useGlobalStore();

onMounted(async () => {
  await globalStore.getSystemConfigs();
});
</script>

<style lang="less">
@import '@/assets/css/common.less';
</style>
