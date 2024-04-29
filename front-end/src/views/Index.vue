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
import { getCurrentUser } from '@/utils/account';

let loading = $ref(false);

const judgeLoginStatus = async () => {
  if (location.hash === '#' + LOGIN_URL) {
    loading = false;
    return;
  }
  await getCurrentUser();
  loading = false;
};

onMounted(() => {
  judgeLoginStatus();
});
</script>
