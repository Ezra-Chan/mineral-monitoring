<template>
  <div class="smooth-carousel w-full h-full flex items-center gap-4">
    <el-button class="w-6 h-60%" @click="swiperRef.slidePrev()">
      <el-icon :size="22"><CaretLeft /></el-icon>
    </el-button>
    <swiper
      class="w-calc-5 h-full flex items-center"
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
    <el-button class="w-6 h-60%" @click="swiperRef.slideNext()">
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
});
const modules = [FreeMode, Pagination];
const swiperRef = shallowRef();
const onSwiper = swiper => {
  swiperRef.value = swiper;
};
</script>

<style lang="less" scoped>
.smooth-carousel {
  --swiper-pagination-bottom: 0;

  :deep(.swiper-wrapper) {
    height: calc(100% - 4rem);
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
