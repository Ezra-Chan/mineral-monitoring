<template>
  <div class="tool-bar-ri flex items-center justify-center gap-5 p-r-6">
    <theme-switch />
    <Message v-if="warehouses.length && Object.keys(BUTTONS).length" />
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
import { useAuthButtons } from '@/hooks/useAuthButtons';

const { BUTTONS } = useAuthButtons('alert');
const userStore = useUserStore();
const { warehouses, userInfo } = $(userStore);
const name = computed(() => userInfo.name);
</script>
