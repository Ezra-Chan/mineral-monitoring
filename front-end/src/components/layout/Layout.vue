<template>
  <el-container class="w-full h-full min-w-3xl!">
    <el-aside class="w-auto!">
      <div
        class="flex flex-col h-full transition-width duration-300 ease"
        :style="{ width: isCollapse ? '65px' : '210px' }"
      >
        <div class="flex items-center justify-center gap-4 h-13.75">
          <img class="w8 object-contain" src="@/assets/images/Logo.png" alt="logo" />
          <span v-show="!isCollapse" class="fs-1.5 font-bold whitespace-nowrap logo-text">
            数字储运
          </span>
        </div>
        <el-scrollbar class="h-calc-3.43!">
          <el-menu
            :default-active="activeMenu"
            :collapse="isCollapse"
            :router="false"
            :unique-opened="true"
            :collapse-transition="false"
            class="w-full overflow-x-hidden border-r-none!"
          >
            <SubMenu :menu-list="menuList" />
          </el-menu>
        </el-scrollbar>
      </div>
    </el-aside>
    <el-container>
      <el-header class="flex items-center justify-between h-13.75 p-x-4 p-y-0">
        <ToolBarLeft />
        <ToolBarRight />
      </el-header>
      <Main />
    </el-container>
  </el-container>
</template>

<script setup name="layoutVertical">
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/store/auth';
import { useGlobalStore } from '@/store/global';
import ToolBarLeft from '@/components/layout/Header/ToolBarLeft.vue';
import ToolBarRight from '@/components/layout/Header/ToolBarRight.vue';
import SubMenu from '@/components/layout/SubMenu.vue';

const route = useRoute();
const authStore = useAuthStore();
const globalStore = useGlobalStore();
const isCollapse = computed(() => globalStore.isCollapse);
const menuList = computed(() => authStore.showMenuListGet);
const activeMenu = computed(() => (route.meta.activeMenu ? route.meta.activeMenu : route.path));
</script>

<style lang="less" scoped>
@import './index.less';
</style>
