<template>
  <div class="tool-bar-ri flex items-center justify-center gap-5 p-r-6">
    <theme-switch />
    <Message id="message" />
    <full-screen-button size="30px" color="inherit" hoverColor="inherit" />
    <span class="username fs-1">{{ username }}</span>
    <Avatar />
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user';
import Message from '@/components/layout/Header/components/StationMessage.vue';
import Avatar from '@/components/layout/Header/components/Avatar.vue';
import ThemeSwitch from '@/components/layout/Header/components/ThemeSwitch.vue';

const userStore = useUserStore();
const username = computed(() => userStore.userInfo.username);
</script>

<style scoped lang="less">
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 25px;
  gap: 20px;
}
</style>
