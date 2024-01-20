<template>
  <div
    class="pie-chart w-full h-full"
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

const onResize = () => myChart.value?.resize();

const initChart = async () => {
  try {
    loading = true;
    myChart.value = echarts.init(chartRef.value);
    const list = globalStore.wareHouse.map(item => item.id);
    const value = await Promise.all([...list.map(querySingleData)]);
    let dt = [];
    value.forEach(item => (dt = dt.concat(item)));
    const map = {};
    dt.forEach(item => {
      if (!map[item.key]) {
        map[item.key] = 0;
      }
      map[item.key] += item.value;
    });
    const chartData = [];
    Object.keys(map).forEach(key => {
      chartData.push({
        value: toFixed2(map[key]),
        name: goodsType.value[key],
      });
    });
    const options = {
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
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['35%', '60%'],
          data: chartData,
          label: {
            color: '#fff',
            formatter: '{b}\n{c}m³\n{d}%',
          },
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
    myChart.value.setOption(options);
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
  return Object.keys(goodsMap).map(key => ({ key, value: goodsMap[key] }));
};

onMounted(() => {
  initChart();
});
</script>
