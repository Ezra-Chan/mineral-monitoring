<template>
  <div
    class="bigscreen-box w-full h-full flex flex-col p2 relative"
    :class="{ 'center-box': type.includes('center') }"
  >
    <div class="w-full h-10 flex justify-between items-center">
      <el-text v-if="title" class="color-white fs-1 letter-spacing-0.2">{{ title }}</el-text>
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
    leftBottom: 'rotate(180deg) scaleY(-1)',
    rightTop: 'scaleY(-1)',
  };
  return mapping[props.type];
});
</script>

<style lang="less" scoped>
.bigscreen-box {
  &::after {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: url('@/assets/images/detail-bg.png') no-repeat right bottom;
    background-size: cover;
    transform: v-bind(degre);
    opacity: 0.6;
    border-radius: 0.25rem;
    box-shadow: inset 0 0 4px 4px #0009;
  }

  &.center-box::after {
    background: url('@/assets/images/detail-bg.png') no-repeat;
  }

  & > div {
    z-index: 1;
  }
}
</style>
