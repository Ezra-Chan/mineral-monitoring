<template>
  <v-scale-screen width="1920" height="1080">
    <div id="bigscreen" class="w-full h-full flex flex-col justify-between">
      <div class="bigscreen-header h-20 flex justify-center items-center select-none">
        <div class="flex gap-10 self-start absolute left-0">
          <Weather
            v-if="wareHouseDetail.addressCityDesc"
            :key="wareHouseDetail.addressCityDesc"
            :city="cities[wareHouseDetail.addressCityDesc]"
          />
          <el-tooltip effect="dark" content="点击跳往可信仓系统" v-if="currentWareHouse">
            <el-text @click="openRadarSystem" type="primary" class="fs-1 p-r-1 cursor-pointer">
              {{ wareHouseInfo }}
            </el-text>
          </el-tooltip>
        </div>
        <el-text class="letter-spacing-0.5 p-l-5 fs-2.5 color-white fw-bold">
          {{ globalStore.systemTitle }}
        </el-text>
        <div class="flex items-center gap-10 absolute right-0 self-start p-r-4 h-12.5">
          <el-select v-model="currentWareHouse" :teleported="false" style="width: 10rem">
            <el-option
              v-for="item in globalStore.wareHouse"
              :key="item.id"
              :label="item.fullName"
              :value="item.id"
            />
          </el-select>
          <real-time />
          <full-screen-button />
        </div>
      </div>
      <div class="w-full h-calc-5.5 flex flex-col justify-between items-center gap-2">
        <el-row class="w-full h-50%" :gutter="8">
          <el-col :span="7" class="h-full">
            <Inventory />
          </el-col>
          <el-col :span="10" class="h-full">
            <bigscreen-box title="视频监控" type="center">
              <Carousel
                v-if="globalStore.wareHouseIdMapCameras && currentWareHouse"
                :length="globalStore.wareHouseIdMapCameras[currentWareHouse].length"
                :smooth="true"
                :key="currentWareHouse + ':Carousel'"
                :showButton="false"
              >
                <template
                  v-for="item in globalStore.wareHouseIdMapCameras[currentWareHouse].length"
                  :key="item"
                  v-slot:[item]
                >
                  <div class="w-full h-full flex flex-col justify-between items-center">
                    <!-- <video
                      class="w-full h-calc-2"
                      muted
                      autoplay
                      controls
                      controlslist="nodownload noplaybackrate noremoteplayback"
                      :disablePictureInPicture="true"
                      poster=""
                    >
                      <source
                        :src="
                          '/api2/live/media' +
                          globalStore.wareHouseIdMapCameras[currentWareHouse][item - 1]
                            .accessPoint +
                          '?format=mp4'
                        "
                      />
                    </video> -->
                    <video-player
                      class="w-full h-calc-2"
                      :src="
                        globalStore.wareHouseIdMapCameras[currentWareHouse][item - 1].accessPoint
                      "
                      :key="
                        globalStore.wareHouseIdMapCameras[currentWareHouse][item - 1].accessPoint +
                        videoKeys[
                          globalStore.wareHouseIdMapCameras[currentWareHouse][item - 1].accessPoint
                        ]
                      "
                      @update="updateVideo"
                    />
                    <el-text class="fs-1">{{
                      globalStore.wareHouseIdMapCameras[currentWareHouse][item - 1].name
                    }}</el-text>
                  </div>
                </template>
              </Carousel>
            </bigscreen-box>
          </el-col>
          <el-col :span="7" class="h-full">
            <bigscreen-box title="货物存量分组柱状图" type="rightTop">
              <bar-chart v-if="currentWareHouse" />
            </bigscreen-box>
          </el-col>
        </el-row>
        <el-row class="w-full h-50%" :gutter="8">
          <el-col :span="7" class="h-full">
            <Inventory :default-date="dayjs().subtract(1, 'day')" type="leftBottom" />
          </el-col>
          <el-col :span="10" class="h-full">
            <bigscreen-box title="货物体积变化曲线图" type="centerBottom">
              <curve-chart v-if="currentWareHouse" :key="currentWareHouse + ':Curve'" />
            </bigscreen-box>
          </el-col>
          <el-col :span="7" class="h-full">
            <bigscreen-box title="仓库动态" type="rightBottom">
              <event-list />
            </bigscreen-box>
          </el-col>
        </el-row>
      </div>
    </div>
  </v-scale-screen>
</template>

<script setup>
import dayjs from 'dayjs';
import VScaleScreen from 'v-scale-screen';
import { getWareHouseList, getWareHouseDetail, getDict } from '@/api/radar';
import { getCameraList, getLayouts } from '@/api/camera';
import { useGlobalStore } from '@/store/global';
import Inventory from './components/Inventory.vue';
import CurveChart from './components/CurveChart.vue';
import BarChart from './components/BarChart.vue';
import EventList from './components/EventList.vue';
import cities from '@/utils/cities.json';
import VideoPlayer from '../../components/Video.vue';

const globalStore = useGlobalStore();
let cameras = $ref([]);
const currentWareHouse = ref(globalStore.currentWareHouse);
let wareHouseDetail = $ref({});
const videoKeys = $ref([]);
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

const getCameraLayout = async () => {
  const { data: { items = [] } = {} } = await getLayouts(dayjs().valueOf());
  const cameraMaps = {};
  items.forEach((item = {}) => {
    const { id, cells = [] } = item.body || {};
    cameraMaps[id] = Object.values(cells)
      .filter(cell => cell.camera_ap)
      .map(cell => cell.camera_ap);
  });
  const wareHouseIdMapCameras = {};
  globalStore.radarCameraMap.forEach(item => {
    wareHouseIdMapCameras[item.wareHouseId] = cameraMaps[item.cameraLayoutId];
  });
  const keys = Object.keys(wareHouseIdMapCameras);
  keys.forEach(key => {
    wareHouseIdMapCameras[key] = wareHouseIdMapCameras[key].map(item => {
      const detail = cameras.find(c => c.accessPoint === item);
      const accessPoint = item.replace('hosts', '').replace(/0$/, '1');
      videoKeys[accessPoint] = dayjs().valueOf();
      return {
        accessPoint,
        name: detail?.displayName || '',
      };
    });
  });
  globalStore.setGlobalState({ wareHouseIdMapCameras });
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

const openRadarSystem = () => {
  const id = currentWareHouse.value;
  const wareHouseInfo = globalStore.wareHouse.find(item => item.id === id) || {};
  const { houseHight, houseLength, houseWidth } = wareHouseInfo;
  const url = `https://app.or-intech.com/#/wms/wmsInfo?id=${id}&houseHight=${houseHight}&houseLength=${houseLength}&houseWidth=${houseWidth}&isQuick=true`;
  window.open(url);
};

const updateVideo = key => {
  videoKeys[key] = dayjs().valueOf();
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
  queryCameraList();
  getCameraLayout();
  queryWareHouses();
});
</script>

<style lang="less" scoped>
@import './cover.less';

#bigscreen {
  background: url('@/assets/images/bg.png') no-repeat center center;
  background-color: rgb(10, 28, 50);
  background-size: cover;
  .bigscreen-header {
    background: url('@/assets/images/title-bg.png') no-repeat;
    background-size: 100% 150%;
  }
  //进度条
  video::-webkit-media-controls-timeline {
    display: none;
  }
  //观看的当前时间
  video::-webkit-media-controls-current-time-display {
    display: none;
  }
  //剩余时间
  video::-webkit-media-controls-time-remaining-display {
    display: none;
  }
  //音量按钮
  video::-webkit-media-controls-mute-button {
    display: none;
  }
  //播放按钮
  video::-webkit-media-controls-play-button {
    display: none;
  }
  //所有控件
  video::-webkit-media-controls-enclosure {
    display: none;
  }
}
</style>
