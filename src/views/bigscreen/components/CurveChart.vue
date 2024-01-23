<template>
  <div
    class="curve-chart w-full h-full"
    ref="chartRef"
    v-element-size="onResize"
    v-loading="loading"
    element-loading-background="#0004"
  />
</template>

<script setup>
import * as echarts from 'echarts';
import dayjs from 'dayjs';
import { vElementSize } from '@vueuse/components';
import { getDataByTime } from '@/api/radar';
import { GlobalStore } from '@/store';
import { toFixed2 } from '@/utils/math';
import { gradientColors } from '@/utils/constant';

const globalStore = GlobalStore();
const chartRef = ref(null);
const myChart = shallowRef();
let loading = $ref(false);
const format = 'YYYY-MM-DD 23:59:59';
const pastTenDate = Array.from({ length: 10 })
  .map((_, i) => dayjs().subtract(i, 'day').format(format))
  .reverse();
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

const onResize = () => myChart.value?.resize();

const initChart = async () => {
  try {
    loading = true;
    myChart.value = echarts.init(chartRef.value);
    const values = await Promise.all(pastTenDate.map(queryInventoryByTime));
    const dtMap = [];
    values.forEach(item => {
      item.forEach(({ key }) => {
        if (!dtMap.includes(key)) {
          dtMap.push(key);
        }
      });
    });
    const series = dtMap.map((key, i) => ({
      name: goodsType.value[key],
      data: values.map(item => {
        const value = item.find(item => item.key === key)?.value;
        return isNaN(value) ? 0 : value;
      }),
      type: 'line',
      smooth: true,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: gradientColors[i % 3][0],
          },
          {
            offset: 1,
            color: gradientColors[i % 3][1],
          },
        ]),
      },
    }));
    myChart.value.setOption({
      animationDuration: 2000,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
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
        data: pastTenDate.map(date => dayjs(date).format('M-D')),
        axisLine: {
          show: true,
          lineStyle: {
            color: '#fff',
          },
        },
      },
      yAxis: {
        name: '单位：m³',
        type: 'value',
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

const queryInventoryByTime = async time => {
  const { data = {} } = await getDataByTime(globalStore.currentWareHouse, time);
  const { infoList = [] } = data;
  const wareHouseGoodsType = currentWareHouseInfo.value.goodsType;
  const goodsMap = {};
  infoList.forEach(item => {
    const type = item.goodsNo || wareHouseGoodsType;
    if (!goodsMap[type]) {
      goodsMap[type] = 0;
    }
    goodsMap[type] += item.actualVolume || 0;
  });
  return Object.keys(goodsMap).map(key => ({
    key,
    value: toFixed2(goodsMap[key]),
  }));
};

onMounted(() => {
  initChart();
});
</script>

<style lang="less" scoped></style>
