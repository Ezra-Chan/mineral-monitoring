<template>
  <div class="flex flex-col gap-2" v-loading="loading" element-loading-background="#0004">
    <div class="flex justify-between">
      <el-date-picker
        v-model="date"
        type="date"
        format="YYYY-MM-DD"
        style="width: 150px"
        :clearable="false"
        :disabled-date="disabledDate"
        :value-format="format"
        @change="handleDateChange"
      />
      <el-text class="color-white fs-1" v-if="dataTime">数据时间：{{ dataTime }}</el-text>
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
import { getDataByTime } from '@/api/radar';

const globalStore = GlobalStore();
const props = defineProps({
  defaultDate: {
    type: [Date, Array, Number, String],
    default: dayjs().valueOf(),
  },
  cb: Function,
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
const format = 'YYYY-MM-DD 23:59:59';
let dataSource = $ref([]);
let loading = $ref(false);
const date = $ref(dayjs(props.defaultDate).format(format));
let dataTime = $ref();
const currentWareHouseInfo = computed(() =>
  globalStore.wareHouse.find(item => item.id === globalStore.currentWareHouse),
);
const goodsType = computed(() => {
  const map = {};
  globalStore.goodsType.forEach(item => {
    map[item.code] = item.desc;
  });
  return map;
});

const disabledDate = time => time.getTime() > dayjs();

const queryGoodsInventory = async time => {
  if (globalStore.currentWareHouse) {
    loading = true;
    try {
      const { data = {} } = await getDataByTime(globalStore.currentWareHouse, time);
      const { fileUpdateTime, infoList = [] } = data;
      dataTime = fileUpdateTime;
      const wareHouseGoodsType = currentWareHouseInfo.value.goodsType;
      const goodsMap = {};
      infoList.forEach(item => {
        const type = item.goodsNo || wareHouseGoodsType;
        if (!goodsMap[type]) {
          goodsMap[type] = {
            volume: 0,
            weight: 0,
          };
        }
        goodsMap[type].volume += item.actualVolume || 0;
        goodsMap[type].weight += item.actualWeight || 0;
      });
      const ds = Object.keys(goodsMap).map(goods => ({
        type: goodsType.value?.[goods],
        volume: Math.round((goodsMap[goods].volume || 0) * 100) / 100,
        weight: Math.round((goodsMap[goods].weight || 0) * 100) / 100,
      }));
      dataSource = ds;
    } catch (error) {
    } finally {
      loading = false;
    }
  }
};

const handleDateChange = t => props.cb?.(t);

watch(
  () => date,
  time => {
    queryGoodsInventory(time);
  },
  { immediate: true },
);
</script>
