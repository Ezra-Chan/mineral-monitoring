<template>
  <div id="themeSwitch" title="切换主题">
    <el-switch
      v-model="theme"
      :active-icon="Moon"
      :inactive-icon="Sunny"
      inline-prompt
      @change="changeTheme"
      aria-label="切换主题"
    />
  </div>
</template>

<script setup>
import { Sunny, Moon } from '@element-plus/icons-vue';
import { useGlobalStore } from '@/store/global';

const globalStore = useGlobalStore();
// 暗黑模式
const isDark = useDark();
const toggleDark = useToggle(isDark);
let theme = $ref(isDark);
const changeTheme = e => {
  toggleDark();
  theme = e;
  globalStore.setGlobalState({ isDark: e });
};
</script>

<style lang="less">
#themeSwitch {
  .el-switch.is-checked .el-switch__core {
    background-color: var(--el-border-color);
    border-color: var(--el-border-color);
  }
}
</style>
