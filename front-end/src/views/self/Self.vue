<template>
  <el-card class="h-100%" :body-style="{ 'padding-right': 0 }">
    <el-tabs v-model="activeTab" class="h-100%">
      <el-tab-pane v-for="tab in tabs" :label="tab.label" :name="tab.value" class="h-100%">
        <KeepAlive>
          <component :is="tab.comp" />
        </KeepAlive>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup>
import { useUserStore } from '@/store/user';
import ChangePwd from './ChangePwd.vue';
import SelfInfo from './SelfInfo.vue';

const userStore = useUserStore();
const { userInfo } = $(userStore);
const tabs = markRaw([
  {
    label: '个人信息',
    value: 'info',
    comp: SelfInfo,
  },
  {
    label: '修改密码',
    value: 'password',
    comp: ChangePwd,
  },
]);
let activeTab = $ref(tabs[0].value);
</script>

<style lang="less" scoped></style>
