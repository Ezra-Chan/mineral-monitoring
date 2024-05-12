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
import { useGlobalStore } from '@/store/global';
import { toFixed2 } from '@/utils/math';
import { barGradientColors } from '@/utils/constant';
import { watch } from 'vue';

const props = defineProps({
  loopTooltip: {
    type: Boolean,
    default: true,
  },
});

const globalStore = useGlobalStore();
const barChartSwitch = useStorage('barChartSwitch', false);
const warehouses = computed(() =>
  barChartSwitch.value
    ? [globalStore.currentWareHouse]
    : globalStore.wareHouse.map(item => item.kx_warehouse_id),
);
const chartRef = ref(null);
const myChart = shallowRef();
let loading = $ref(false);
const timer = ref();
const wareHouseGoods = computed(() => {
  const map = {};
  globalStore.wareHouse.forEach(item => {
    map[item.kx_warehouse_id] = item.goodsType;
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
  label: {
    show: true,
    color: '#fff',
    formatter: ({ value }) => value || '',
    rotate: 90,
  },
  emphasis: {
    focus: 'series',
  },
  barWidth: 30,
};

const onResize = () => myChart.value?.resize();

const addListener = (chart, option) => {
  return new Promise(resolve => {
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
  let seriesLength = option.series.length; // 多少个系列需要轮播
  timer.value = setInterval(() => {
    /**
     * 派发展示tootip事件，第一个系列
     * 派发一次，就弹出tootip
     * */
    const dataIndex = option.series[i].xAxisIndex;
    chart.dispatchAction({
      type: 'showTip',
      seriesIndex: i,
      dataIndex,
    });
    // chart.dispatchAction({ type: 'highlight', seriesIndex: i, dataIndex });
    /**
     * 当跑到最后一个的时候，再回到第一项
     * */
    if (i === seriesLength - 1) {
      i = 0;
    } else {
      i++;
    }
  }, 1500);
};

const initChart = async () => {
  try {
    loading = true;
    if (myChart.value) {
      myChart.value.dispose();
    }
    myChart.value = echarts.init(chartRef.value);
    const values = await Promise.all(warehouses.value.map(querySingleData));
    const goodsMap = [];
    values.forEach(item => {
      Object.keys(item).forEach(key => {
        if (!goodsMap.includes(key)) {
          goodsMap.push(key);
        }
      });
    });
    const series = [];
    const dealBar = (arr, name) => {
      const bar = [];
      arr.forEach((item, index) => {
        const data = [];
        for (let i = 0; i < index; i++) {
          data.push('');
        }
        if (item) {
          data.push(item);
          const colors = barGradientColors[goodsMap.indexOf(name) % barGradientColors.length];
          bar.push({
            ...serie,
            name: goodsType.value[name],
            xAxisIndex: index,
            data,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: colors[0],
                },
                {
                  offset: 1,
                  color: colors[1],
                },
              ]),
              borderRadius: 50,
            },
          });
        }
      });
      return bar;
    };
    const datas = goodsMap.map(key => warehouses.value.map((_, i) => toFixed2(values[i][key])));
    datas.forEach((dt, i) => series.push(...dealBar(dt, goodsMap[i])));
    const options = {
      tooltip: {
        trigger: 'item',
        confine: true,
        backgroundColor: 'rgb(24,44,72)',
        borderColor: 'rgb(8,127,192)',
        textStyle: {
          color: '#fff',
        },
        axisPointer: {
          type: 'shadow',
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
      xAxis: globalStore.wareHouse
        .filter(w => warehouses.value.includes(w.kx_warehouse_id))
        .map((item, index) => {
          const data = Array(warehouses.value.length).fill('');
          data[index] = item.name;
          return {
            type: 'category',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#999',
              },
            },
            position: 'bottom',
            data,
          };
        }),
      yAxis: {
        type: 'value',
        name: '单位：吨',
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
    console.error(error);
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
    goodsMap[type] += item.actualWeight || 0;
  });
  return goodsMap;
};

watch(
  () => [barChartSwitch.value, globalStore.currentWareHouse],
  ([newSwitch], [oldSwitch]) => {
    if (newSwitch || newSwitch !== oldSwitch) initChart();
  },
);

onMounted(() => {
  initChart();
});
</script>
