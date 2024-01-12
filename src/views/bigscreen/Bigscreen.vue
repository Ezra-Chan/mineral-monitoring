<template>
  <div id="bigscreen" class="w-full h-full flex flex-col">
    <div class="bigscreen-header h-20 flex justify-between items-center">
      <div>天气</div>
      <div class="fs-2.5 color-white">仓库监管集成平台</div>
      <div>时间</div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
#bigscreen {
  background: linear-gradient(180deg, #383e7f, #111130);
  .bigscreen-header {
    background: url('@/assets/images/title-bg.png') no-repeat;
    background-size: 100%;
  }
}
</style>
