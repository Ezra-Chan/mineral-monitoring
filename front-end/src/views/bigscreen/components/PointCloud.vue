<template>
  <div
    class="w-full h-full"
    ref="chartRef"
    v-element-size="onResize"
    v-loading="loading"
    element-loading-background="#0004"
  />
</template>

<script setup>
import * as echarts from 'echarts';
import 'echarts-gl';
import { vElementSize } from '@vueuse/components';
import { radarChartTypes, barColors } from '@/utils/constant';
import { toFixed2 } from '@/utils/math';
import { getCloudPointData } from '@/api/radar';
import { GlobalStore } from '@/store';

const axis = {
  type: 'value',
  min: 0,
  name: '',
};
const grid = {
  axisLine: {
    lineStyle: { color: '#fff' },
  },
  axisPointer: {
    lineStyle: { color: '#fff' },
  },
  viewControl: {
    minAlpha: 0,
    minBeta: 0,
    maxBeta: 90,
    beta: 50,
    distance: 230,
  },
  boxDepth: 200,
  boxHeight: 50,
};

const barOption = {
  tooltip: {
    show: true,
    backgroundColor: 'rgb(24,44,72)',
    borderColor: 'rgb(8,127,192)',
    textStyle: {
      color: '#fff',
    },
    extraCssText: 'box-shadow: rgba(0, 0, 0, 0.2) 1px 2px 10px',
    confine: true,
    formatter: params => {
      const { seriesName, seriesIndex } = params;
      const data = series[seriesIndex] || {};
      return `<div class="point-cloud-tooltip">
                <div>货物名称：${seriesName || ''}</div>
                <div>实测重量(登记重量)：${data.actualWeight || ''}吨</div>
                <div>体积：${data.actualVolume || ''}m³</div>
              </div>`;
    },
  },
  xAxis3D: {
    ...axis,
  },
  yAxis3D: {
    ...axis,
  },
  zAxis3D: {
    ...axis,
  },
  grid3D: {
    light: {
      main: {
        intensity: 1.2,
      },
      ambient: {
        intensity: 0.3,
      },
    },
    ...grid,
  },
  series: [
    {
      type: 'bar3D',
      data: [],
      emphasis: {
        itemStyle: {
          color: '#EEE',
        },
        label: {
          show: false,
        },
      },
      shading: 'lambert',
      label: {
        show: false,
      },
      barWidth: 30,
    },
  ],
};
const pointOption = {
  xAxis3D: {
    ...axis,
  },
  yAxis3D: {
    ...axis,
  },
  zAxis3D: {
    ...axis,
  },
  grid3D: {
    ...grid,
  },
  series: [
    {
      type: 'scatter3D',
      data: [],
      itemStyle: {
        color: '#F46B4B',
      },
      label: {
        show: false,
      },
      emphasis: {
        label: {
          show: false,
        },
      },
      symbolSize: 2,
    },
  ],
};

const props = defineProps({
  type: {
    type: String,
    default: radarChartTypes[0].value,
  },
  time: {
    type: [String, Number, Date, Array],
    default: '',
  },
});
const globalStore = GlobalStore();

const chartRef = ref();
let myChart = shallowRef();
let loading = $ref(false);
let series = [];

const goodsType = computed(() => {
  const map = {};
  globalStore.goodsType.forEach(item => {
    map[item.code] = item.desc;
  });
  return map;
});

const onResize = () => myChart.value?.resize();

const getData = async () => {
  loading = true;
  try {
    if (myChart.value) {
      myChart.value.dispose();
    }
    myChart.value = echarts.init(chartRef.value);
    const id = globalStore.currentWareHouse;
    const { data = [] } = await getCloudPointData(props.type, id, props.time);
    const { infoList = [], fileDate = [] } = data;
    const wareHouse = globalStore.wareHouse.find(item => item.id === id) || {};
    const { houseHight, houseLength, houseWidth } = wareHouse;
    const isBar = props.type === radarChartTypes[0].value;
    const chartOption = isBar ? barOption : pointOption;
    chartOption.xAxis3D.max = houseWidth;
    chartOption.yAxis3D.max = houseLength;
    chartOption.zAxis3D.max = houseHight;
    if (isBar) {
      // 堆形图
      const s = infoList.map((item, i) => {
        return {
          ...barOption.series[0],
          itemStyle: {
            color: barColors[i % barColors.length],
            opacity: 0.8,
          },
          name: item.goodsNo ? goodsType.value[item.goodsNo] : wareHouse.goodsTypeDesc,
          data: item.goodsData,
          actualVolume: toFixed2(item.actualVolume),
          actualWeight: toFixed2(item.actualWeight),
        };
      });
      series = s;
      chartOption.series = series;
    } else {
      // 点云图
      chartOption.series = [
        {
          ...pointOption.series[0],
          data: fileDate,
        },
      ];
    }
    myChart.value.setOption(chartOption);
  } catch (error) {
    console.error(error);
    ElMessage({ type: 'error', message: '获取数据失败' });
  } finally {
    loading = false;
  }
};

watch(
  () => props.type,
  () => getData(),
);

onMounted(() => {
  getData();
});
</script>

<style lang="less">
.point-cloud-tooltip {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: flex-start;
}
</style>
