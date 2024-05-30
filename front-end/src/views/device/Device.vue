<template>
  <div class="flex gap-3 h-full">
    <div class="card w-80">
      <WarehouseTree @select="handleSelect" />
    </div>
    <div class="card flex-1 flex flex-col gap-2">
      <template v-if="select">
        <template v-if="select.type === 'warehouse'">
          <el-text size="large">{{ select.name }}</el-text>
          <el-tabs type="border-card" class="warehouse-devices">
            <el-tab-pane>
              <template #label>
                <div class="flex gap-2 items-center">
                  <svg-icon icon-class="icon-radar" size="14px" color="inherit" />
                  <span>雷达</span>
                </div>
              </template>
              <Lidar :key="select" :warehouse="select" />
            </el-tab-pane>
            <el-tab-pane>
              <template #label>
                <div class="flex gap-2 items-center">
                  <el-icon><VideoCamera /></el-icon>
                  <span>摄像头</span>
                </div>
              </template>
              <Camera :key="select" :warehouse="select" />
            </el-tab-pane>
          </el-tabs>
          <!-- <div v-else>{{ select.name }}</div> -->
        </template>
      </template>
    </div>
  </div>
</template>

<script setup>
import { VideoCamera } from '@element-plus/icons-vue';
import Lidar from './Lidar.vue';
import Camera from './Camera.vue';

let select = $ref();

const handleSelect = node => {
  select = node;
};
</script>

<style lang="less" scoped>
:deep(.warehouse-devices.el-tabs) {
  height: calc(100% - 30px);

  .el-tabs__content {
    height: calc(100% - 39px);

    .el-tab-pane {
      height: 100%;

      .card {
        border: 0;
        box-shadow: none;
      }
    }
  }
}
</style>
