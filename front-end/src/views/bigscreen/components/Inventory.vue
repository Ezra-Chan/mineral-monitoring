<template>
  <bigscreen-box :type="type" title="货物存量" ref="carouselRef">
    <template #headerRight>
      <el-radio-group v-model="radarChart">
        <el-radio-button v-for="(type, i) in radarChartTypes" :label="type.value" :key="i">
          {{ type.label }}
        </el-radio-button>
      </el-radio-group>
    </template>
    <div class="w-full h-full flex flex-col gap-1 justify-end items-center">
      <div class="w-full flex justify-between">
        <el-date-picker
          v-model="date"
          type="date"
          format="YYYY-MM-DD"
          style="width: 150px; font-size: 14px"
          size="small"
          :teleported="false"
          :clearable="false"
          :disabled-date="disabledDate"
          :value-format="format"
        />
        <div class="flex items-center gap-2">
          <el-text class="color-white fs-0.8" v-if="dataTime"> 数据时间：{{ dataTime }} </el-text>
          <!-- <full-screen :el="carouselRef" size="1rem" /> -->
        </div>
      </div>
      <Carousel class="h-calc-2" noDrag :length="2" :showButton="false" :showSize="1">
        <template #1>
          <point-cloud
            v-if="globalStore.currentWareHouse"
            :key="globalStore.currentWareHouse + date"
            :type="radarChart"
            :time="dayjs(date).format(format)"
            class="h-calc-1.5"
          />
        </template>
        <template #2>
          <el-table
            stripe
            class="goods-inventory w-full h-calc-5"
            :data="dataSource"
            :header-row-style="{
              background: 'rgba(14, 188, 225, 0.3)',
              color: 'var(--el-color-primary)',
            }"
          >
            <el-table-column
              v-for="item in columns"
              align="center"
              :key="item.prop"
              :prop="item.prop"
              :label="item.label"
            />
          </el-table>
        </template>
      </Carousel>
    </div>
  </bigscreen-box>
</template>

<script setup>
import dayjs from 'dayjs';
import { useGlobalStore } from '@/store/global';
import { getDataByTime } from '@/api/radar';
import PointCloud from './PointCloud.vue';
import { radarChartTypes } from '@/utils/constant';

const props = defineProps({
  defaultDate: {
    type: [Date, Array, Number, String],
    default: dayjs().valueOf(),
  },
  type: {
    type: String,
    default: 'leftTop',
  },
  cb: Function,
});
const globalStore = useGlobalStore();
const columns = [
  {
    prop: 'type',
    label: '品类',
  },
  {
    prop: 'volume',
    label: '体积(m³)',
  },
  {
    prop: 'weight',
    label: '重量(吨)',
  },
];
const format = 'YYYY-MM-DD 23:59:59';
const radarChart = $ref(radarChartTypes[0].value);
const dataSource = ref([]);
const date = $ref(dayjs(props.defaultDate).format(format));
let dataTime = $ref();
const carouselRef = $ref();
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
      dataSource.value = ds;
    } catch (error) {}
  }
};

watch(
  () => [date, globalStore.currentWareHouse],
  ([time]) => {
    queryGoodsInventory(time);
  },
  { immediate: true },
);
</script>

<style lang="less">
.goods-inventory {
  &.el-table {
    --el-table-border-color: transparent;
    --el-fill-color-lighter: rgba(14, 188, 225, 0.1);
  }
}
</style>
