<template>
  <div
    id="container"
    class="w-full h-full"
    v-loading.fullscreen.lock="loading"
    element-loading-background="#050A11"
  >
    <Bigscreen v-if="showType === SHOW_TYPE.BIGSCREEN" />
    <Login v-else-if="showType === SHOW_TYPE.LOGIN" />
  </div>
</template>

<script setup>
import { getUserInfo } from '@/api/radar';
import Login from '@/views/login/Login.vue';
import Bigscreen from '@/views/bigscreen/Bigscreen.vue';

const SHOW_TYPE = markRaw({
  EMPTY: 0,
  LOGIN: 1,
  BIGSCREEN: 2,
});
let showType = $ref(SHOW_TYPE.EMPTY);
let loading = $ref(true);

const judgeLoginStatus = async () => {
  if (location.pathname === '/login') {
    showType = SHOW_TYPE.LOGIN;
    loading = false;
    return;
  }
  await getUserInfo();
  showType = SHOW_TYPE.BIGSCREEN;
  loading = false;
};

onMounted(() => {
  judgeLoginStatus();
});
</script>
