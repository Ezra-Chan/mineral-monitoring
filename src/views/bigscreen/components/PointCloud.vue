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
import { watch } from 'vue';

const barOption = {
  itemStyle: {
    color: '#D9D19C',
    opacity: 0.8,
  },
  emphasis: {
    itemStyle: {
      color: '#D8D8D2',
    },
  },
  shading: 'lambert',
  xAxis3D: {
    type: 'value',
  },
  yAxis3D: {
    type: 'value',
  },
  zAxis3D: {
    type: 'value',
  },
  grid3D: {
    boxWidth: 200,
    boxDepth: 80,
    light: {
      main: {
        intensity: 1.2,
      },
      ambient: {
        intensity: 0.3,
      },
    },
    axisLine: {
      lineStyle: { color: '#fff' },
    },
    axisPointer: {
      lineStyle: { color: '#fff' },
    },
  },
  series: [
    {
      type: 'bar3D',
      data: [],
    },
  ],
};
const pointOption = {
  coordinateSystem: 'cartesian3D',
  itemStyle: {
    color: '#F46B4B',
  },
  blendMode: 'lighter',
  xAxis3D: {
    type: 'value',
  },
  yAxis3D: {
    type: 'value',
  },
  zAxis3D: {
    type: 'value',
  },
  grid3D: {
    axisLine: {
      lineStyle: { color: '#fff' },
    },
    axisPointer: {
      lineStyle: { color: '#fff' },
    },
    // viewControl: {
    //   autoRotate: true,
    // },
  },
  series: [
    {
      type: 'scatter3D',
      data: [],
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
let myChart = $ref();
let loading = $ref(false);

const onResize = () => myChart?.resize();

const getData = async () => {
  loading = true;
  try {
    const { data = [] } = await getCloudPointData(props.type, globalStore.currentWareHouse);
    const { infoList = [], fileDate = [], fileUpdateTime } = data;
    props.cb(fileUpdateTime);
    const isBar = props.type === radarChartTypes[0].value;
    const chartOption = isBar ? barOption : pointOption;
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
    console.log(chartOption);
    myChart && myChart.clear();
    myChart = echarts.init(chartRef.value);
    myChart.setOption(chartOption);
  } catch (error) {
    ElMessage({ type: 'error', message: '获取数据失败' });
  } finally {
    loading = false;
  }
};

watch(
  () => [props.type, globalStore.currentWareHouse],
  () => getData(),
);

onMounted(() => {
  getData();
});
</script>
