<template>
  <div
    class="fullscreen inline-flex items-center justify-center border-rdp-50 cursor-pointer"
    @click="toggle"
    :title="isFullscreen ? '退出全屏' : '全屏'"
  >
    <svg-icon
      :icon-class="isFullscreen ? 'icon-fullscreen-exit' : 'icon-fullscreen'"
      :size="size"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  el: {
    type: Object,
    default: void 0,
  },
  size: {
    type: String,
    default: '2.2rem',
  },
});
const { toggle, isFullscreen } = useFullscreen(props.el);
</script>

<style lang="less">
.fullscreen {
  // width: 4rem;
  // height: 4rem;

  .svg-icon .icon {
    color: rgb(86, 225, 219);
    &:hover {
      color: #409eff;
    }
  }
}
</style>
