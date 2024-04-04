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
import { LOGIN_URL } from '@/config';

let loading = $ref(false);

const judgeLoginStatus = async () => {
  if (location.pathname === LOGIN_URL) {
    loading = false;
    return;
  }
  try {
    await getUserInfo();
  } catch (error) {}
  loading = false;
};

onMounted(() => {
  judgeLoginStatus();
});
</script>
