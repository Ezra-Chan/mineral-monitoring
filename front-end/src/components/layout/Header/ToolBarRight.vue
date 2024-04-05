<template>
  <div class="tool-bar-ri">
    <div class="header-icon">
      <Message id="message" />
      <full-screen-button size="30px" color="inherit" hoverColor="inherit" />
    </div>
    <span class="username">{{ username }}</span>
    <Avatar />
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user';
import Message from '@/components/layout/Header/components/StationMessage.vue';
import Avatar from '@/components/layout/Header/components/Avatar.vue';

const userStore = useUserStore();
const username = computed(() => userStore.userInfo.username);
</script>

<style scoped lang="less">
.tool-bar-ri {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 25px;
  .header-icon {
    display: flex;
    align-items: center;
    & > * {
      margin-left: 21px;
    }
  }
  .username {
    margin: 0 20px;
    font-size: 15px;
  }
}
</style>
