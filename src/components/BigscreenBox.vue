<template>
  <div
    class="bigscreen-box w-full h-full flex flex-col p2 relative"
    :class="{ 'after-bg': type.indexOf('center') }"
  >
    <div class="w-full h-12 flex justify-between items-center">
      <el-text v-if="title" class="color-white fs-1">{{ title }}</el-text>
      <slot v-else name="headerLeft"></slot>
      <slot name="headerCenter"></slot>
      <slot name="headerRight"></slot>
    </div>
    <div class="w-full h-calc-3">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'leftTop',
  },
  title: String,
});

const degre = computed(() => {
  const mapping = {
    leftTop: 'rotate(180deg)',
    leftBottom: 'rotate(90deg)',
    right: 'rotate(0deg)',
  };
  return mapping[props.type];
});
</script>

<style lang="less" scoped>
.bigscreen-box {
  &.after-bg::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: url('@/assets/images/detail-bg.png') no-repeat right bottom;
    background-size: cover;
    transform: v-bind(degre);
  }

  & > div {
    z-index: 1;
  }
}
</style>
