<template>
  <bigscreen-box :type="type" title="货物存量" ref="carouselRef">
    <template #headerRight>
      <el-radio-group v-model="radarChart">
        <el-radio-button
          v-for="(type, i) in radarChartTypes"
          :value="type.value"
          :label="type.label"
          :key="i"
        />
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
        </div>
      </div>
      <Carousel class="h-calc-2" noDrag :length="2" :showButton="false" :showSize="1">
        <template #1>
          <point-cloud
            v-if="currentWareHouse"
            :key="currentWareHouse + date"
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
import { useUserStore } from '@/store/user';
import { useDictStore } from '@/store/dictionary';
import { getDataByTime } from '@/api/radar';
import { radarChartTypes } from '@/utils/constant';
import { toFixed2 } from '@/utils/math';
import PointCloud from './PointCloud.vue';

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
  index: Boolean,
});
const userStore = useUserStore();
const globalStore = useGlobalStore();
const dictStore = useDictStore();
const { currentWareHouse, inventory } = $(globalStore);
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
  userStore.warehouses.find(item => item.kx_warehouse_id === currentWareHouse),
);

const disabledDate = time => time.getTime() > dayjs();

const queryGoodsInventory = async time => {
  if (currentWareHouse) {
    try {
      const { data = {} } = await getDataByTime(currentWareHouse, time);
      const { fileUpdateTime, infoList = [] } = data;
      dataTime = fileUpdateTime;
      const wareHouseGoodsType =
        currentWareHouseInfo.value.goodsType || currentWareHouseInfo.value.goodsTypeDesc;
      const goodsMap = {};
      infoList.forEach(item => {
        const type = item.foodstuffType || wareHouseGoodsType || item.foodstuffTypeDesc;
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
        type: dictStore.dict.GOODS_TYPE[goods] || goods,
        volume: Math.round((goodsMap[goods].volume || 0) * 100) / 100,
        weight: Math.round((goodsMap[goods].weight || 0) * 100) / 100,
      }));
      dataSource.value = ds;
      globalStore.setGlobalState({
        inventory: {
          ...inventory,
          [currentWareHouse]: {
            ...(inventory[currentWareHouse] || {}),
            [+props.index]: ds,
          },
        },
      });
    } catch (error) {}
  }
};

const addPrefix = val => (val > 0 ? `+${val}` : val);

watch(
  globalStore.inventory,
  newVal => {
    const current = newVal[currentWareHouse]?.[+props.index];
    const compare = newVal[currentWareHouse]?.[+!props.index];
    if (current && compare) {
      const goodsType = newVal[currentWareHouse][0].map(item => item.type);
      newVal[currentWareHouse][1].forEach(item => {
        if (!goodsType.includes(item.type)) {
          goodsType.push(item.type);
        }
      });
      const dt = goodsType.map(goods => {
        const defaultGoods = {
          type: goods,
          volume: 0,
          weight: 0,
        };
        const currentItem = current.find(item => item.type === goods) || defaultGoods;
        const compareItem = compare.find(item => item.type === goods) || defaultGoods;
        const volumeDiff = toFixed2(currentItem.volume - compareItem.volume);
        const weightDiff = toFixed2(currentItem.weight - compareItem.weight);
        return {
          type: goods,
          volume: currentItem.volume + `（${addPrefix(volumeDiff)}）`,
          weight: currentItem.weight + `（${addPrefix(weightDiff)}）`,
        };
      });
      dataSource.value = dt;
    }
  },
  {
    deep: true,
  },
);

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
