<template>
  <div
    class="fullscreen inline-flex items-center justify-center border-rdp-50 cursor-pointer"
    @click="toggle"
    :title="isFullscreen ? '退出全屏' : '全屏'"
  >
    <svg-icon
      :icon-class="isFullscreen ? 'icon-fullscreen-exit' : 'icon-fullscreen'"
      size="2.2rem"
    />
  </div>
</template>

<script setup>
const { toggle, isFullscreen } = useFullscreen();
</script>

<style lang="less">
.fullscreen {
  width: 4rem;
  height: 4rem;

  .svg-icon .icon {
    color: #fff;
    &:hover {
      color: #409eff;
    }
  }
}
</style>
