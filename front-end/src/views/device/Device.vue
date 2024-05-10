<template>
  <div class="flex gap-3 h-full">
    <div class="card w-80">
      <WarehouseTree @select="handleSelect" />
    </div>
    <div class="card flex-1">
      <template v-if="select">
        <el-tabs v-if="select.type === 'warehouse'" class="warehouse-devices">
          <el-tab-pane label="雷达">
            <Lidar :key="select" :warehouse="select" />
          </el-tab-pane>
          <el-tab-pane label="摄像头">
            <Camera :key="select" :warehouse="select" />
          </el-tab-pane>
        </el-tabs>
        <!-- <div v-else>{{ select.name }}</div> -->
      </template>
    </div>
  </div>
</template>

<script setup>
import Lidar from './Lidar.vue';
import Camera from './Camera.vue';

let select = $ref();

const handleSelect = node => {
  select = node;
};
</script>

<style lang="less" scoped>
:deep(.warehouse-devices.el-tabs) {
  height: 100%;

  .el-tabs__content {
    height: calc(100% - 39px);

    .el-tab-pane {
      height: 100%;
    }
  }
}
</style>
