<template>
  <div class="flex gap-3 h-full">
    <div class="card w-80">
      <WarehouseTree @select="handleSelect" />
    </div>
    <div class="card flex-1">
      <template v-if="select">
        <el-tabs v-if="select.type === 'warehouse'" type="border-card">
          <el-tab-pane label="User">User</el-tab-pane>
          <el-tab-pane label="Config">Config</el-tab-pane>
          <el-tab-pane label="Role">Role</el-tab-pane>
          <el-tab-pane label="Task">Task</el-tab-pane>
        </el-tabs>
      </template>
    </div>
  </div>
</template>

<script setup>
let select = $ref();

const handleSelect = node => {
  select = node;
};
</script>

<style lang="less" scoped></style>
