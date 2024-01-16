<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between">
      <el-date-picker v-model="date" type="date" :clearable="false" :disabled-date="disabledDate" />
      <el-text class="color-white fs-1">{{ dataTime }}</el-text>
    </div>
    <el-table border size="small" class="w-full" :data="dataSource">
      <el-table-column
        v-for="item in columns"
        align="center"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
      />
    </el-table>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { GlobalStore } from '@/store';

const globalStore = GlobalStore();
const props = defineProps({
  defaultDate: {
    type: [Date, Array, Number, String],
    default: dayjs().valueOf(),
  },
});
const columns = [
  {
    prop: 'type',
    label: '品类',
  },
  {
    prop: 'volume',
    label: '体积',
  },
  {
    prop: 'weight',
    label: '重量',
  },
];
let dataSource = $ref([]);

const date = $ref(props.defaultDate);
let dataTime = $ref();

const disabledDate = time => time.getTime() > dayjs();

const queryGoodsInventory = async (id, time) => {
  console.log(id, time);
};

// watch(
//   () => [globalStore.currentWareHouse, date],
//   newVal => {
//     queryGoodsInventory(newVal);
//   },
// );
watch(
  () => [globalStore.currentWareHouse, date],
  ([id, time]) => {
    id && queryGoodsInventory(id, time);
  },
  {
    immediate: true,
  },
);
</script>

<style lang="less" scoped></style>
