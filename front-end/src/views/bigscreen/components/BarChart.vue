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
import { colors } from '@/utils/constant';

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
  let j = 0;
  let length = option.xAxis.data.length; // 多少个需要轮播
  let seriesLength = option.series.length; // 多少个系列需要轮播
  timer.value = setInterval(() => {
    /**
     * 派发展示tootip事件，第一个系列
     * 派发一次，就弹出tootip
     * */
    chart.dispatchAction({
      type: 'showTip',
      seriesIndex: j,
      dataIndex: i,
    });
    // chart.dispatchAction({ type: 'highlight', seriesIndex: 0, dataIndex: i }); // 派发高亮此案例用不到
    /**
     * 当跑到最后一个的时候，再回到第一项
     * */
    if (i === length - 1) {
      i = 0;
      if (j === seriesLength - 1) {
        j = 0;
      } else {
        j++;
      }
    } else {
      i++;
    }
  }, 1500);
};

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
    const options = {
      color: colors,
      tooltip: {
        trigger: 'item',
        confine: true,
        backgroundColor: 'rgb(24,44,72)',
        borderColor: 'rgb(8,127,192)',
        textStyle: {
          color: '#fff',
        },
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
        data: globalStore.wareHouse.map(item => item.fullName),
        axisLine: {
          show: true,
          lineStyle: {
            color: '#999',
          },
        },
      },
      yAxis: {
        type: 'value',
        name: '单位：m³',
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
