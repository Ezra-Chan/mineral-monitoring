<template>
  <v-scale-screen width="1920" height="1080">
    <div v-if="show" id="bigscreen" class="w-full h-full flex flex-col justify-between">
      <div class="bigscreen-header h-20 flex justify-center items-center select-none">
        <div class="flex gap-10 self-start absolute left-0">
          <Weather
            v-if="wareHouseDetail.addressCityDesc"
            :key="wareHouseDetail.addressCityDesc"
            :city="cities[wareHouseDetail.addressCityDesc] ?? wareHouseDetail.addressCityDesc"
          />
          <el-text type="primary" class="fs-1 p-r-1" v-if="currentWareHouse">
            {{ wareHouseInfo }}
          </el-text>
        </div>
        <el-text
          class="letter-spacing-0.5 p-l-5 fs-2.5! color-white fw-bold cursor-pointer"
          @click="jumpToSystem"
        >
          {{ globalStore.systemTitle }}
        </el-text>
        <div class="flex items-center gap-8 absolute right-0 self-start p-r-4 h-12.5">
          <el-select v-model="currentWareHouse" :teleported="false" style="width: 10rem">
            <el-option
              v-for="item in warehouses"
              :key="item.id"
              :label="item.name"
              :value="item.kx_warehouse_id"
            />
          </el-select>
          <real-time />
          <Message
            v-if="warehouses.length && Object.keys(BUTTONS).length"
            style="--color: #fff"
            size="30px"
          />
          <full-screen-button />
        </div>
      </div>
      <div class="w-full h-calc-5.5 flex flex-col justify-between items-center gap-2">
        <el-row class="w-full h-50% z-10" :gutter="8">
          <el-col :span="7" class="h-full">
            <Inventory :index="true" />
          </el-col>
          <el-col :span="10" class="h-full">
            <bigscreen-box title="视频监控" type="center">
              <Carousel
                v-if="currentWareHouse && cameras[currentWareHouse]?.length"
                :length="cameras[currentWareHouse].length"
                :smooth="true"
                :key="currentWareHouse + ':Carousel'"
                :showButton="false"
              >
                <template
                  v-for="item in cameras[currentWareHouse].length"
                  :key="item"
                  v-slot:[item]
                >
                  <div class="w-full h-full flex flex-col justify-between items-center">
                    <video-player
                      class="w-full h-calc-2"
                      :src="
                        handleCameraPath(cameras[currentWareHouse][item - 1].monitor_device_path)
                      "
                      :key="
                        cameras[currentWareHouse][item - 1].monitor_device_path +
                        videoKeys[
                          cameras[currentWareHouse][item - 1].monitor_device_path.replace(/0$/, '1')
                        ]
                      "
                      @update="updateVideo"
                    />
                    <el-text class="fs-1">
                      {{ cameras[currentWareHouse][item - 1].monitor_device_name }}
                    </el-text>
                  </div>
                </template>
              </Carousel>
            </bigscreen-box>
          </el-col>
          <el-col :span="7" class="h-full">
            <bigscreen-box title="仓库动态" type="rightTop">
              <template #headerCenter>
                <div class="fs-1 c-white">
                  当日事件总数:
                  <span class="fw-bold">{{ eventListTotal }}</span>
                </div>
              </template>
              <template #headerRight>
                <el-switch
                  v-model="eventListSwitch"
                  inline-prompt
                  active-text="联动"
                  inactive-text="全部"
                />
              </template>
              <event-list
                v-if="currentWareHouse && Object.keys(cameras)?.length"
                :cameras="cameras"
                @update="num => (eventListTotal = num)"
              />
            </bigscreen-box>
          </el-col>
        </el-row>
        <el-row class="w-full h-50%" :gutter="8">
          <el-col :span="7" class="h-full">
            <Inventory
              :index="false"
              :default-date="dayjs().subtract(1, 'day').valueOf()"
              type="leftBottom"
            />
          </el-col>
          <el-col :span="10" class="h-full">
            <bigscreen-box title="货物体积变化曲线图" type="centerBottom">
              <curve-chart v-if="currentWareHouse" :key="currentWareHouse + ':Curve'" />
            </bigscreen-box>
          </el-col>
          <el-col :span="7" class="h-full">
            <bigscreen-box title="货物存量分组柱状图" type="rightBottom">
              <template #headerRight>
                <el-switch
                  v-model="barChartSwitch"
                  inline-prompt
                  active-text="联动"
                  inactive-text="全部"
                />
              </template>
              <bar-chart v-if="currentWareHouse" />
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
import { getDeviceList } from '@/api/platform';
import { useGlobalStore } from '@/store/global';
import { useUserStore } from '@/store/user';
import { useAuthStore } from '@/store/auth';
import { HOME_URL } from '@/config';
import cities from '@/utils/cities.json';
import { SYSTEM_ROLES_MAP } from '@/utils/constant';
import { handleCameraPath } from '@/utils';
import Inventory from './components/Inventory.vue';
import CurveChart from './components/CurveChart.vue';
import BarChart from './components/BarChart.vue';
import EventList from './components/EventList.vue';
import VideoPlayer from '../../components/Video.vue';
import Message from '@/components/layout/Header/components/StationMessage.vue';
import { useAuthButtons } from '@/hooks/useAuthButtons';

const route = useRoute();
const router = useRouter();
const globalStore = useGlobalStore();
const userStore = useUserStore();
const authStore = useAuthStore();
const barChartSwitch = useStorage('barChartSwitch', false);
const eventListSwitch = useStorage('eventListSwitch', false);

const { BUTTONS } = useAuthButtons('alert');
const { userInfo, warehouses } = $(userStore);
let show = $ref(false);
let cameras = $ref({});
let eventListTotal = $ref(0);
const currentWareHouse = ref(globalStore.currentWareHouse);
let wareHouseDetail = $ref({});
const videoKeys = $ref({});
const wareHouseInfo = computed(
  () =>
    `${wareHouseDetail.houseTypeDesc || '平房仓'}(长:${wareHouseDetail.length || 0}米，宽:${
      wareHouseDetail.width || 0
    }米，高:${wareHouseDetail.height || 0}米)`,
);

const queryCameraList = async () => {
  const warehouseMap = {};
  const { data = {} } = await getDeviceList(undefined, {
    warehouse_id: warehouses.map(w => {
      warehouseMap[w.id] = w.kx_warehouse_id;
      return w.id;
    }),
  });
  const cameraMap = {};
  data.results.forEach(item => {
    if (!cameraMap[warehouseMap[item.warehouse_id]]) {
      cameraMap[warehouseMap[item.warehouse_id]] = [];
    }
    cameraMap[warehouseMap[item.warehouse_id]].push(item);
  });
  cameras = cameraMap;
};

const queryWareHouseDetail = id => {
  const item = warehouses.find(item => item.kx_warehouse_id === id) || {};
  item.addressCityDesc = item.location?.split('/')[1];
  wareHouseDetail = item;
};

const updateVideo = key => {
  videoKeys['hosts' + key] = dayjs().valueOf();
};

const jumpToSystem = () => {
  if (authStore.hasPermission('system')) {
    router.push(HOME_URL);
  }
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

onBeforeMount(async () => {
  if (userInfo.role_id === SYSTEM_ROLES_MAP.SUPER_ADMIN) {
    const { company } = route.query;
    if (!company) return ElMessage.error('请选择公司');
    // TODO
  } else {
    if (!warehouses.length) return ElMessage.error('您没有仓库权限');
    currentWareHouse.value = warehouses[0]?.kx_warehouse_id;
    show = true;
  }
  queryCameraList();
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
