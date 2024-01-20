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
import { radarChartTypes } from '@/utils/constant';
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
  },
  boxDepth: 200,
};

const barOption = {
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
      itemStyle: {
        color: '#D9D19C',
        opacity: 0.8,
      },
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
  cb: {
    type: Function,
    default: () => {},
  },
});
const globalStore = GlobalStore();

const chartRef = ref();
let myChart = shallowRef();
let loading = $ref(false);

const onResize = () => myChart.value?.resize();
const getData = async () => {
  loading = true;
  try {
    const id = globalStore.currentWareHouse;
    const { data = [] } = await getCloudPointData(props.type, id);
    const { infoList = [], fileDate = [], fileUpdateTime } = data;
    props.cb(fileUpdateTime);
    const wareHouse = globalStore.wareHouse.find(item => item.id === id) || {};
    const { houseHight, houseLength, houseWidth } = wareHouse;
    const isBar = props.type === radarChartTypes[0].value;
    const chartOption = isBar ? barOption : pointOption;
    chartOption.xAxis3D.max = houseWidth;
    chartOption.yAxis3D.max = houseLength;
    chartOption.zAxis3D.max = houseHight;
    if (isBar) {
      // 堆形图
      let barData = [];
      infoList.forEach(item => {
        barData = barData.concat(item.goodsData);
      });
      chartOption.series[0].data = barData;
    } else {
      // 点云图
      chartOption.series[0].data = fileDate;
    }
    myChart.value.setOption(chartOption);
  } catch (error) {
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
  myChart.value = echarts.init(chartRef.value);
  getData();
});
</script>
