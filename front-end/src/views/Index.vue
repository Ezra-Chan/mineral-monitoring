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
import { LOGIN_URL } from '@/config';
import { initSystem } from '@/utils/init';

let loading = $ref(false);

const judgeLoginStatus = async () => {
  if (location.hash === '#' + LOGIN_URL) {
    loading = false;
    return;
  }
  await initSystem();
  loading = false;
};

onMounted(() => {
  judgeLoginStatus();
});
</script>
