<template>
  <div class="card h-full">
    <el-tabs class="h-full system-tabs">
      <template v-for="item in showTabs" :key="item.name">
        <el-tab-pane class="h-full">
          <template #label>
            <div class="flex gap-2 items-center">
              <el-icon>
                <component :is="item.icon" />
              </el-icon>
              <span>{{ item.label }}</span>
            </div>
          </template>
          <component :is="item.component" />
        </el-tab-pane>
      </template>
    </el-tabs>
  </div>
</template>

<script setup>
import { useAuthButtons } from '@/hooks/useAuthButtons';
import SystemSetting from './SystemSetting.vue';
import AlertSetting from './AlertSetting.vue';

const tabs = [
  {
    label: '系统',
    name: 'system',
    component: SystemSetting,
    icon: 'Setting',
  },
  {
    label: '告警',
    name: 'alert',
    component: AlertSetting,
    icon: 'Bell',
  },
];

const { BUTTONS } = useAuthButtons();

const showTabs = computed(() => tabs.filter(t => BUTTONS.value[t.name]));
</script>

<style lang="less" scoped>
.system-tabs {
  :deep(.el-tabs__content) {
    height: calc(100% - 55px);
  }
}
</style>
