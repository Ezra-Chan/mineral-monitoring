<template>
  <div
    id="container"
    class="w-full h-full"
    v-loading.fullscreen.lock="loading"
    element-loading-background="#050A11"
  >
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import { getUserInfo } from '@/api/radar';

let loading = $ref(false);

const judgeLoginStatus = async () => {
  if (location.pathname === '/login') {
    loading = false;
    return;
  }
  await getUserInfo();
  loading = false;
};

onMounted(() => {
  judgeLoginStatus();
});
</script>
