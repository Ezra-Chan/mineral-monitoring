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
import { getCurrentUserApi } from '@/api/platform';
import { LOGIN_URL } from '@/config';

let loading = $ref(false);
const judgeLoginStatus = async () => {
  if (location.hash === '#' + LOGIN_URL) {
    loading = false;
    return;
  }
  try {
    await getCurrentUserApi();
  } catch (error) {}
  loading = false;
};

onMounted(() => {
  judgeLoginStatus();
});
</script>
