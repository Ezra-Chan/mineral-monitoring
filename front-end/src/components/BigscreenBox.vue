<template>
  <div
    class="bigscreen-box w-full h-full flex flex-col justify-between p2 relative"
    :class="{ 'center-box': type.includes('center') }"
  >
    <div class="bigscreen-box-header w-full h-10 flex justify-between items-center relative">
      <div v-if="title" class="bigscreen-box-title flex items-center">
        <img :src="logo" alt="" class="w-8 h-8 scale-150" />
        <el-text class="fs-1 letter-spacing-0.2">{{ title }}</el-text>
      </div>
      <slot v-else name="headerLeft"></slot>
      <slot name="headerCenter"></slot>
      <slot name="headerRight"></slot>
    </div>
    <div class="bigscreen-box-content w-full h-calc-3 flex flex-col overflow-y-auto">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import logo from '@/assets/images/title-icon.svg';

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
const showAfter = computed(() => (props.title ? 'block' : 'none'));
</script>

<style lang="less" scoped>
.bigscreen-box {
  &::after {
    content: '';
    width: calc(100% - 2px);
    height: calc(100% - 2px);
    position: absolute;
    top: 0;
    left: 0;
    background: url('@/assets/images/detail-bg.png') no-repeat right bottom;
    background-size: cover;
    transform: v-bind(degre);
    opacity: 0.6;
    border-radius: 0.25rem;
    border: 1px solid rgba(141, 255, 233, 0.3);
    backdrop-filter: blur(10px);
    // box-shadow: inset 0 0 4px 4px #0009;
  }

  &.center-box::after {
    background: url('@/assets/images/detail-bg.png') no-repeat;
  }

  & > div {
    z-index: 1;
  }

  .bigscreen-box-header {
    &::after {
      // display: v-bind(showAfter);
      content: '';
      width: 100%;
      height: 2px;
      background-image: url('@/assets/images/border-bottom.svg');
      position: absolute;
      bottom: 0;
      background-size: cover;
    }
    .bigscreen-box-title {
      text-shadow: 0px 0px 5px #00a3ff;
      color: #cff;
    }
  }

  .bigscreen-box-content {
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: rgba(0, 0, 0, 0.2);

      &:hover {
        background-color: rgba(0, 0, 0, 0.3);
        cursor: pointer;
      }
    }
  }
}
</style>
