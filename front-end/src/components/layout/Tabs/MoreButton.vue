<template>
  <el-dropdown trigger="click" :teleported="false">
    <div class="more-button h-full w-10 flex items-center justify-center b-l cursor-pointer">
      <el-icon>
        <arrow-down />
      </el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="refresh">
          <el-icon><Refresh /></el-icon>刷新
        </el-dropdown-item>
        <el-dropdown-item @click="maximize">
          <el-icon><FullScreen /></el-icon>最大化
        </el-dropdown-item>
        <el-dropdown-item divided @click="closeCurrentTab">
          <el-icon><Remove /></el-icon>关闭当前
        </el-dropdown-item>
        <el-dropdown-item @click="tabStore.closeTabsOnSide(route.fullPath, 'left')">
          <el-icon><DArrowLeft /></el-icon>关闭左侧
        </el-dropdown-item>
        <el-dropdown-item @click="tabStore.closeTabsOnSide(route.fullPath, 'right')">
          <el-icon><DArrowRight /></el-icon>关闭右侧
        </el-dropdown-item>
        <el-dropdown-item @click="closeOtherTab">
          <el-icon><CircleClose /></el-icon>关闭其它
        </el-dropdown-item>
        <el-dropdown-item @click="closeAllTab">
          <el-icon><FolderDelete /></el-icon>关闭所有
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { inject, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { HOME_URL } from '@/config';
import { useTabsStore } from '@/store/tabs';
import { useGlobalStore } from '@/store/global';
import { useKeepAliveStore } from '@/store/keepAlive';

const route = useRoute();
const router = useRouter();
const tabStore = useTabsStore();
const globalStore = useGlobalStore();
const keepAliveStore = useKeepAliveStore();

const refreshCurrentPage = inject('refresh');
const refresh = () => {
  setTimeout(() => {
    keepAliveStore.removeKeepAliveName(route.name);
    refreshCurrentPage(false);
    nextTick(() => {
      keepAliveStore.addKeepAliveName(route.name);
      refreshCurrentPage(true);
    });
  }, 0);
};

const maximize = () => {
  globalStore.setGlobalState({ maximize: true });
};

const closeCurrentTab = () => {
  if (route.meta.isAffix) return;
  tabStore.removeTabs(route.fullPath);
  keepAliveStore.removeKeepAliveName(route.name);
};

const closeOtherTab = () => {
  tabStore.closeMultipleTab(route.fullPath);
  keepAliveStore.setKeepAliveName([route.name]);
};

const closeAllTab = () => {
  tabStore.closeMultipleTab();
  keepAliveStore.setKeepAliveName();
  router.push(HOME_URL);
};
</script>

<style scoped lang="less">
@import './index.less';
.more-button {
  border-left: 1px solid var(--el-border-color-light);

  &:hover {
    background-color: var(--el-color-info-light-9);
  }
}
</style>
