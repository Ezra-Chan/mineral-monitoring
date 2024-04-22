<template>
  <el-row :gutter="20" class="self-info h-100%">
    <el-col :lg="6" :md="8">
      <el-card :body-style="{ 'padding-top': '4rem' }">
        <div class="flex flex-col items-center gap-8">
          <span class="font-500 text-8 truncate w-100% text-center" :title="realName">
            {{ userInfo.name }}
          </span>
          <div class="text-6 flex gap-8">
            <span title="性别">{{ userInfo.sex }}</span>
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :lg="18" :md="16" class="h-100%">
      <el-card class="h-100%" :body-style="{ 'padding-right': 0 }">
        <el-tabs v-model="activeTab" class="h-100%">
          <el-tab-pane v-for="tab in tabs" :label="tab.label" :name="tab.value" class="h-100%">
            <KeepAlive>
              <component :is="tab.comp" />
            </KeepAlive>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
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
