<template>
  <div class="real-time flex flex-col">
    <el-text class="color-inherit fs-1.5">{{ time }}</el-text>
    <el-text class="color-inherit fs-0.8">
      {{ date }}
      {{ day }}
    </el-text>
  </div>
</template>

<script setup>
const now = useNow();
const time = useDateFormat(now, 'HH:mm:ss');
const date = useDateFormat(now, 'YYYY-MM-DD');
const day = useDateFormat(now, 'ddd');
</script>

<style lang="less" scoped>
.real-time {
  color: rgb(86, 225, 219);
  letter-spacing: 2px;
}
</style>
