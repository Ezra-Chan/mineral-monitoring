<template>
  <div
    class="fullscreen inline-flex items-center justify-center border-rdp-50 cursor-pointer"
    @click="toggle"
    :title="isFullscreen ? '退出全屏' : '全屏'"
  >
    <svg-icon
      :icon-class="isFullscreen ? 'icon-fullscreen-exit' : 'icon-fullscreen'"
      :size="iconSize"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps(['el', 'size']);
const iconSize = computed(() => props.size || '2.2rem');
console.log(props.el);
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
