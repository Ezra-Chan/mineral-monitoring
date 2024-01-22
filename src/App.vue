<template>
  <ElConfigProvider :locale="zhCN">
    <Index />
  </ElConfigProvider>
</template>

<script setup>
import videojs from 'video.js';
import zhCN from 'element-plus/dist/locale/zh-cn.mjs';
import Index from './views/Index.vue';

videojs.Vhs.xhr.beforeRequest = function (options) {
  const headers = options.headers || {};
  headers['Authorization'] = 'Basic cm9vdDpIaHN6Y3lAMTIzNDU=';
  console.log(headers);
  options.headers = headers;
  return options;
};
</script>

<style lang="less">
@import './assets/css/common.less';
</style>
