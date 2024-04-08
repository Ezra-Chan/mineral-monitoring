<template>
  <div class="flex items-center justify-center overflow-hidden whitespace-nowrap">
    <CollapseIcon id="collapseIcon" />
    <Breadcrumb v-show="globalStore.breadcrumb" id="breadcrumb" />
  </div>
</template>

<script setup>
import { useGlobalStore } from '@/store/global';
import CollapseIcon from '@/components/layout/Header/components/CollapseIcon.vue';
import Breadcrumb from '@/components/layout/Header/components/Breadcrumb.vue';

const globalStore = useGlobalStore();
</script>
