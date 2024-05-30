<template>
  <div class="tool-bar-ri flex items-center justify-center gap-5 p-r-6">
    <theme-switch />
    <Message />
    <full-screen-button size="22px" color="inherit" hoverColor="inherit" />
    <span class="username fs-1">{{ name }}</span>
    <Avatar />
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user';
import Message from '@/components/layout/Header/components/StationMessage.vue';
import Avatar from '@/components/layout/Header/components/Avatar.vue';
import ThemeSwitch from '@/components/layout/Header/components/ThemeSwitch.vue';

const userStore = useUserStore();
const name = computed(() => userStore.userInfo.name);
</script>
