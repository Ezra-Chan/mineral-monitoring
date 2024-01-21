<template>
  <div id="bigscreen" class="w-full h-full flex flex-col">
    <div class="bigscreen-header h-20 flex justify-center items-center select-none">
      <Weather city="Hechi" class="self-start absolute left-0" />
      <el-text class="letter-spacing-0.5 p-l-5 fs-2.5 color-white fw-bold">
        数字仓储管理平台
      </el-text>
      <div class="flex items-center gap-15 absolute right-0 self-start p-r-4 h-12.5">
        <el-select v-model="currentWareHouse">
          <el-option
            v-for="item in globalStore.wareHouse"
            :key="item.id"
            :label="item.fullName"
            :value="item.id"
          />
        </el-select>
        <real-time class="color-white" />
      </div>
    </div>
    <div class="w-full h-calc-5 flex-1 flex flex-col justify-between items-center gap-2">
      <el-row class="w-full h-50%" :gutter="8">
        <el-col :span="7" class="h-full">
          <bigscreen-box class="" title="货物体积变化曲线图">
            <curve-chart :key="currentWareHouse + ':Curve'" />
          </bigscreen-box>
        </el-col>
        <el-col :span="10" class="h-full">
          <bigscreen-box class="" title="视频监控" type="center">
            <Carousel :length="['大门', '仓内', '后门']" :smooth="true">
              <template v-for="item in ['大门', '仓内', '后门']" :key="item" v-slot:[item]>
                <div class="w-full h-full flex flex-col justify-between items-center">
                  <video
                    class="w-full h-calc-2"
                    src="http://vd3.bdstatic.com/mda-qaj9zjyf871krg42/360p/h264/1705734190377815932/mda-qaj9zjyf871krg42.mp4"
                    muted
                    autoplay
                    controls
                    poster=""
                  />
                  <span>{{ item }}</span>
                </div>
              </template>
            </Carousel>
            <!-- <video-monitor
              src="WIN-VUPGBFMIFQN/DeviceIpint.1/SourceEndpoint.video:0:0"
              :header="videoHeader"
              v-if="cameras.length"
            /> -->
          </bigscreen-box>
        </el-col>
        <el-col :span="7" class="h-full">
          <bigscreen-box class="" title="货物存量堆叠柱状图" type="rightTop">
            <bar-chart />
          </bigscreen-box>
        </el-col>
      </el-row>
      <el-row class="w-full h-50%" :gutter="8">
        <el-col :span="7" class="h-full">
          <bigscreen-box class="" title="货物存量" type="leftBottom">
            <div class="h-full flex flex-col justify-between">
              <Inventory
                class="h-50%"
                :key="currentWareHouse + ':Inventory1'"
                :defaultDate="firstTime.valueOf()"
                :cb="t => (firstTime = t)"
              />
              <Inventory
                class="h-50%"
                :key="currentWareHouse + ':Inventory2'"
                :defaultDate="secondTime.valueOf()"
                :cb="t => (secondTime = t)"
              />
            </div>
          </bigscreen-box>
        </el-col>
        <el-col :span="10" class="h-full">
          <bigscreen-box class="" type="center">
            <template #headerLeft>
              <el-radio-group v-model="radarChart">
                <el-radio-button v-for="(type, i) in radarChartTypes" :label="type.value" :key="i">
                  {{ type.label }}
                </el-radio-button>
              </el-radio-group>
            </template>
            <template #headerRight v-if="currentWareHouse">
              <el-tooltip effect="dark" content="点击跳往可信仓系统">
                <el-text @click="openRaderSystem" class="color-blue fs-1 p-r-1 cursor-pointer">
                  {{ wareHouseInfo }}
                </el-text>
              </el-tooltip>
            </template>
            <!-- <template #headerRight v-if="radarDataTime">
              <el-tooltip effect="dark" content="点击跳往可信仓系统">
                <el-text @click="openRaderSystem" class="color-blue fs-1 p-r-2 cursor-pointer">
                  数据时间：{{ radarDataTime }}
                </el-text>
              </el-tooltip>
            </template> -->
            <Carousel :length="2" :showSize="1" noDrag>
              <!-- <template v-for="item in [firstTime, secondTime]" :key="item" v-slot:[item]>
                <point-cloud
                  v-if="currentWareHouse"
                  :key="currentWareHouse + item"
                  :type="radarChart"
                  :time="dayjs(item).format(format)"
                  :cb="time => (radarDataTime = time)"
                />
              </template> -->
              <template #1>
                <div class="w-full h-full flex flex-col justify-between items-center">
                  <span class="fs-1"> 数据时间：{{ radarDataTime1 }} </span>
                  <point-cloud
                    v-if="currentWareHouse"
                    :key="currentWareHouse + firstTime"
                    :type="radarChart"
                    :time="dayjs(firstTime).format(format)"
                    :cb="time => (radarDataTime1 = time)"
                    class="h-calc-1.5"
                  />
                </div>
              </template>
              <template #2>
                <div class="w-full h-full flex flex-col justify-between items-center">
                  <span class="fs-1"> 数据时间：{{ radarDataTime2 }} </span>
                  <point-cloud
                    v-if="currentWareHouse"
                    :key="currentWareHouse + secondTime"
                    :type="radarChart"
                    :time="dayjs(secondTime).format(format)"
                    :cb="time => (radarDataTime2 = time)"
                    class="h-calc-1.5"
                  />
                </div>
              </template>
            </Carousel>
          </bigscreen-box>
        </el-col>
        <el-col :span="7" class="h-full">
          <bigscreen-box class="" title="仓库动态" type="rightBottom"></bigscreen-box>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import VideoMonitor from '@/components/Video.vue';
import { getWareHouseList, getWareHouseDetail, getDataByTime, getDict } from '@/api/radar';
import { getCameraList } from '@/api/camera';
import { GlobalStore } from '@/store';
import Inventory from './components/Inventory.vue';
import PointCloud from './components/PointCloud.vue';
import CurveChart from './components/CurveChart.vue';
import BarChart from './components/BarChart.vue';
import { radarChartTypes } from '@/utils/constant';
// import BifrostCors from 'bifrost-cors';

const globalStore = GlobalStore();
const radarChart = $ref(radarChartTypes[0].value);
let radarDataTime1 = $ref();
let radarDataTime2 = $ref();
let firstTime = $ref(dayjs());
let secondTime = $ref(dayjs().subtract(1, 'day'));
const format = 'YYYY-MM-DD 23:59:59';
const videoHeader = reactive({
  Authorization: 'Basic cm9vdDpIaHN6Y3lAMTIzNDU=',
  'Access-Control-Allow-Origin': '*',
});
let cameras = $ref([]);
const currentWareHouse = ref(globalStore.currentWareHouse);
let wareHouseDetail = $ref({});
const wareHouseInfo = computed(
  () =>
    `${wareHouseDetail.houseTypeDesc || '平房仓'}(长:${wareHouseDetail.houseLength || 0}米，宽:${
      wareHouseDetail.houseWidth || 0
    }米，高:${wareHouseDetail.houseHight || 0}米，堆放限高:${wareHouseDetail.highestGrain || 0}米)`,
);

const queryWareHouses = async () => {
  try {
    const { data = {} } = await getWareHouseList();
    const { list = [] } = data;
    currentWareHouse.value = list[0]?.id;
    globalStore.setGlobalState({ wareHouse: list });
  } catch (error) {
    ElMessage({ type: 'error', message: '获取仓库列表失败，请刷新重试！' });
  }
};

const queryCameraList = async () => {
  const { data = {} } = await getCameraList();
  cameras = data.cameras || [];
};

const queryWareHouseDetail = async id => {
  const { data = {} } = await getWareHouseDetail(id);
  const item = globalStore.wareHouse.find(item => item.id === id) || {};
  wareHouseDetail = { ...item, ...data };
};

const getDictApi = async () => {
  const { data = {} } = await getDict();
  const { FoodstuffTypeEnum = [], HouseTypeEnum = [] } = data;
  globalStore.setGlobalState({ goodsType: FoodstuffTypeEnum, houseType: HouseTypeEnum });
};

const openRaderSystem = () => {
  const id = currentWareHouse.value;
  const wareHouseInfo = globalStore.wareHouse.find(item => item.id === id) || {};
  const { houseHight, houseLength, houseWidth } = wareHouseInfo;
  const url = `https://app.or-intech.com/#/wms/wmsInfo?id=${id}&houseHight=${houseHight}&houseLength=${houseLength}&houseWidth=${houseWidth}&isQuick=true`;

  // const bifrostCors = new BifrostCors('https://app.or-intech.com', false);
  // bifrostCors.setLocalStorage({ key: 'username', value: globalStore.userInfo.username });
  // bifrostCors.setLocalStorage({ key: 'token', value: globalStore.radarToken });
  // console.log(bifrostCors);
  window.open(url);
};

watch(
  currentWareHouse,
  newVal => {
    if (newVal) {
      globalStore.setGlobalState({ currentWareHouse: newVal });
      queryWareHouseDetail(newVal);
    }
  },
  {
    immediate: true,
  },
);

onMounted(() => {
  getDictApi();
  queryWareHouses();
  // queryCameraList();
});
</script>

<style lang="less" scoped>
@import './cover.less';

#bigscreen {
  background: url('@/assets/images/bg.png') no-repeat center center;
  background-size: cover;
  .bigscreen-header {
    background: url('@/assets/images/title-bg.png') no-repeat;
    background-size: 100% 150%;
  }
}
</style>
