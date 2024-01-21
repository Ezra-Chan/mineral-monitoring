<template>
  <div
    class="bar-chart w-full h-full"
    ref="chartRef"
    v-element-size="onResize"
    v-loading="loading"
    element-loading-background="#0004"
  />
</template>

<script setup>
import * as echarts from 'echarts';
import { vElementSize } from '@vueuse/components';
import { getDataByTime } from '@/api/radar';
import { GlobalStore } from '@/store';
import { toFixed2 } from '@/utils/math';

const globalStore = GlobalStore();
const chartRef = ref(null);
const myChart = shallowRef();
let loading = $ref(false);
const wareHouseGoods = computed(() => {
  const map = {};
  globalStore.wareHouse.forEach(item => {
    map[item.id] = item.goodsType;
  });
  return map;
});
const goodsType = computed(() => {
  const map = {};
  globalStore.goodsType.forEach(item => {
    map[item.code] = item.desc;
  });
  return map;
});
const serie = {
  type: 'bar',
  stack: 'total',
  label: {
    color: '#fff',
  },
  emphasis: {
    focus: 'series',
  },
};

const onResize = () => myChart.value?.resize();

const initChart = async () => {
  try {
    loading = true;
    myChart.value = echarts.init(chartRef.value);
    const list = globalStore.wareHouse.map(item => item.id);
    const values = await Promise.all(list.map(querySingleData));
    const goodsMap = [];
    values.forEach(item => {
      Object.keys(item).forEach(key => {
        if (!goodsMap.includes(key)) {
          goodsMap.push(key);
        }
      });
    });
    const series = goodsMap.map(key => ({
      ...serie,
      name: goodsType.value[key],
      label: {
        show: true,
        formatter: ({ value }) => value || '',
      },
      data: list.map((_, i) => toFixed2(values[i][key])),
    }));
    myChart.value.setOption({
      tooltip: {
        trigger: 'item',
      },
      legend: {
        orient: 'vertical',
        left: 'right',
        textStyle: {
          color: '#fff',
        },
      },
      xAxis: {
        type: 'category',
        data: globalStore.wareHouse.map(item => item.fullName),
        axisLine: {
          show: true,
          lineStyle: {
            color: '#fff',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: '单位：m³',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#fff',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#999',
            type: 'dashed',
          },
        },
      },
      series,
    });
  } catch (error) {
  } finally {
    loading = false;
  }
};

const querySingleData = async id => {
  const { data = {} } = await getDataByTime(id);
  const { infoList = [] } = data;
  const wareHouseGoodsType = wareHouseGoods.value[id];
  const goodsMap = {};
  infoList.forEach(item => {
    const type = item.goodsNo || wareHouseGoodsType;
    if (!goodsMap[type]) {
      goodsMap[type] = 0;
    }
    goodsMap[type] += item.actualVolume || 0;
  });
  return goodsMap;
};

onMounted(() => {
  initChart();
});
</script>
