<template>
  <div class="flex flex-col gap-2">
    <div class="flex justify-between">
      <el-date-picker v-model="date" type="date" :disabled-date="disabledDate" />
      <el-text class="color-white fs-1">{{ dataTime }}</el-text>
    </div>
    <el-table border class="w-full" :data="dataSource">
      <el-table-column
        v-for="item in columns"
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
    type: Date,
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

const queryGoodsInventory = async id => {
  console.log(id);
};

watch(
  () => globalStore.currentWareHouse,
  newVal => {
    queryGoodsInventory(newVal);
  },
);
</script>

<style lang="less" scoped></style>
