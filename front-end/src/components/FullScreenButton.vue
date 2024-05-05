<template>
  <div
    class="fullscreen inline-flex items-center justify-center border-rdp-50 cursor-pointer"
    @click="toggle"
    :title="isFullscreen ? '退出全屏' : '全屏'"
  >
    <svg-icon
      :icon-class="isFullscreen ? 'icon-fullscreen-exit' : 'icon-fullscreen'"
      :size="iconSize"
      :color="color"
      :hoverColor="hoverColor"
    />
  </div>
</template>

<script setup>
const props = defineProps(['el', 'size', 'color', 'hoverColor']);
const iconSize = computed(() => props.size || '2.2rem');
const color = computed(() => props.color || 'rgb(86, 225, 219)');
const hoverColor = computed(() => props.hoverColor || '#409eff');

const { toggle, isFullscreen } = useFullscreen(props.el);
</script>
