<template>
  <div class="real-time flex flex-col">
    <el-text class="color-inherit fs-1.2">{{ time }}</el-text>
    <el-text class="color-inherit fs-1">{{ date }}</el-text>
  </div>
</template>

<script setup>
const now = useNow();
const time = useDateFormat(now, 'HH:mm:ss');
const date = useDateFormat(now, 'YYYY-MM-DD');
</script>
