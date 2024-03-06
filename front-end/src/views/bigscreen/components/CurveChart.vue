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
import { gradientColors, colors } from '@/utils/constant';

const props = defineProps({
  loopTooltip: {
    type: Boolean,
    default: true,
  },
});

const globalStore = GlobalStore();
const chartRef = ref(null);
const myChart = shallowRef();
let loading = $ref(false);
const timer = ref();
const format = 'YYYY-MM-DD 23:59:59';
const pastTenDate = Array.from({ length: 7 })
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

const addListener = (chart, option) => {
  return new Promise((resolve, reject) => {
    let zRender = chart.getZr();
    // 鼠标经过清除定时器
    chart.on('mouseover', () => {
      if (timer.value) {
        clearInterval(timer.value);
      }
    });
    // 鼠标移动清除定时器
    zRender.on('mousemove', () => {
      if (timer.value) {
        clearInterval(timer.value);
      }
    });
    // 鼠标移动离开再开启轮播
    chart.on('mouseout', function () {
      loopTootip(chart, option);
    });
    // 鼠标全局离开再开启轮播
    zRender.on('globalout', () => {
      loopTootip(chart, option);
    });
    resolve(true);
  });
};

const loopTootip = (chart, option) => {
  if (timer.value) {
    clearInterval(timer.value);
  } // 清空定时器并再设置一个新的定时器
  let i = 0; // 索引0开始tootip轮播
  let length = option.xAxis.data.length; // 多少个需要轮播
  timer.value = setInterval(() => {
    /**
     * 派发展示tootip事件，第一个系列
     * 派发一次，就弹出tootip
     * */
    chart.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: i,
    });
    // chart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: i }); // 派发高亮此案例用不到
    /**
     * 当跑到最后一个的时候，再回到第一项
     * */
    if (i === length - 1) {
      i = 0;
    } else {
      i = i + 1;
    }
  }, 1500);
};

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
      symbolSize: 8,
      areaStyle: {
        opacity: 0.8,
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: gradientColors[i % 4][0],
          },
          {
            offset: 1,
            color: gradientColors[i % 4][1],
          },
        ]),
      },
    }));
    const options = {
      color: colors,
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985',
          },
        },
        backgroundColor: 'rgb(24,44,72)',
        borderColor: 'rgb(8,127,192)',
        textStyle: {
          color: '#fff',
        },
        confine: true,
      },
      grid: { bottom: 30 },
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
            color: '#999',
          },
        },
      },
      yAxis: {
        name: '单位：m³',
        type: 'value',
        axisLine: {
          show: true,
          lineStyle: {
            color: '#999',
          },
        },
        splitLine: {
          show: true,
          lineStyle: {
            color: '#666',
            type: 'dashed',
          },
        },
      },
      series,
    };
    myChart.value.setOption(options);
    if (props.loopTooltip) {
      await addListener(myChart.value, options);
      loopTootip(myChart.value, options);
    }
  } catch (error) {
    console.error('曲线图发生错误', error);
  } finally {
    loading = false;
  }
};

const queryInventoryByTime = async time => {
  const { data = {} } = await getDataByTime(globalStore.currentWareHouse, time);
  const { infoList = [] } = data;
  // const infoList = [
  //   {
  //     goodsNo: 'ZG_ORE',
  //     actualVolume: Math.random() * 3001 + 3000,
  //   },
  //   {
  //     goodsNo: 'ZINC_SUBOXIDE',
  //     actualVolume: Math.random() * 3001 + 3000,
  //   },
  // ];
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
