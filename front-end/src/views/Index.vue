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
import { useUserStore } from '@/store/user';

let loading = $ref(false);
const userStore = useUserStore();

const judgeLoginStatus = async () => {
  if (location.hash === '#' + LOGIN_URL) {
    loading = false;
    return;
  }
  try {
    const { data = {} } = await getCurrentUserApi();
    const { user = {} } = data;
    userStore.setUserInfo({ ...user, sex: Number(user.sex) });
  } catch (error) {}
  loading = false;
};

onMounted(() => {
  judgeLoginStatus();
});
</script>
