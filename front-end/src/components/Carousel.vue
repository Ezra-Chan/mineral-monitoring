<template>
  <div class="smooth-carousel w-full h-full flex items-center gap-2 relative" ref="target">
    <el-button
      v-if="showButton || !isOutside"
      class="w-6 border-rdp-50 absolute left-0 top-1/2 -translate-y-1/2 z-10"
      @click="swiperRef.slidePrev()"
    >
      <el-icon :size="22"><CaretLeft /></el-icon>
    </el-button>
    <swiper
      class="w-full h-full flex items-center"
      :class="{ 'swiper-no-swiping': noDrag }"
      :slides-per-view="showSize"
      :space-between="20"
      :freeMode="smooth"
      :pagination="{
        clickable: true,
      }"
      :modules="modules"
      @swiper="onSwiper"
      @slideChange="onSlideChange"
    >
      <swiper-slide v-for="item in length" :key="item">
        <slot :name="item"></slot>
      </swiper-slide>
    </swiper>
    <el-button
      v-if="showButton || !isOutside"
      class="w-6 border-rdp-50 absolute right-0 top-1/2 -translate-y-1/2 z-10"
      @click="swiperRef.slideNext()"
    >
      <el-icon :size="22"><CaretRight /></el-icon>
    </el-button>
  </div>
</template>

<script setup>
import { CaretLeft, CaretRight } from '@element-plus/icons-vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { FreeMode, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

const props = defineProps({
  length: {
    type: Number,
    default: 0,
  },
  showSize: {
    type: Number,
    default: 2,
  },
  smooth: {
    type: Boolean,
    default: false,
  },
  noDrag: {
    type: Boolean,
    default: false,
  },
  showButton: {
    type: Boolean,
    default: true,
  },
});
const modules = [FreeMode, Pagination];
const swiperRef = shallowRef();
const target = ref(null);

const { isOutside } = useMouseInElement(target);

const onSwiper = swiper => {
  swiperRef.value = swiper;
};
</script>

<style lang="less" scoped>
.smooth-carousel {
  --swiper-pagination-bottom: -0.3rem;

  :deep(.swiper-wrapper) {
    // height: calc(100% - 4rem);
  }
}
.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fff;
}
</style>
