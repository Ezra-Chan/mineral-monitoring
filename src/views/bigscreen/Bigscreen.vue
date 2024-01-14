<template>
  <div id="bigscreen" class="w-full h-full flex flex-col">
    <div class="bigscreen-header h-20 flex justify-center items-center select-none">
      <Weather city="Hechi" class="self-start absolute left-0" />
      <el-text class="letter-spacing-0.5 p-l-5 fs-2.5 color-white fw-bold">
        仓库监管集成平台
        <!-- XXXXXXXXXXX -->
      </el-text>
      <RealTime class="color-white absolute right-0 self-start p-r-4" />
    </div>
    <div class="w-full h-calc-5 flex-1 flex flex-col justify-between items-center gap-2">
      <el-row class="w-full h-50%" :gutter="8">
        <el-col :span="7">
          <BigscreenBox class="" title="货物体积变化曲线图"></BigscreenBox>
        </el-col>
        <el-col :span="10">
          <BigscreenBox class="" title="视频监控" type="center">
            <VideoMonitor
              src="http://root:Hhszcy%4012345@10.1.1.215/live/media/WIN-VUPGBFMIFQN/DeviceIpint.1/SourceEndpoint.video:0:0?w=1600&h=0"
              :header="videoHeader"
            />
          </BigscreenBox>
        </el-col>
        <el-col :span="7">
          <BigscreenBox class="" title="货物存量占比饼图" type="rightTop"></BigscreenBox>
        </el-col>
      </el-row>
      <el-row class="w-full h-50%" :gutter="8">
        <el-col :span="7">
          <BigscreenBox class="" title="货物存量" type="leftBottom"></BigscreenBox>
        </el-col>
        <el-col :span="10">
          <BigscreenBox class="" type="center">
            <template #headerLeft>
              <el-radio-group
                v-model="radarChart"
                style="--el-button-bg-color: transparent; --el-button-text-color: #fff"
              >
                <el-radio-button
                  v-for="(type, i) in radarChartTypes"
                  :label="type.value"
                  :key="i"
                  style="
                    --el-radio-button-checked-bg-color: transparent;
                    --el-radio-button-checked-text-color: var(--el-color-primary);
                  "
                >
                  {{ type.label }}
                </el-radio-button>
              </el-radio-group>
            </template>
          </BigscreenBox>
        </el-col>
        <el-col :span="7">
          <BigscreenBox class="" title="仓库动态" type="rightBottom"></BigscreenBox>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import VideoMonitor from '@/components/Video.vue';
import { getWareHouseList } from '@/api/radar';
import { getCameraList } from '@/api/camera';
import { GlobalStore } from '@/store';
import { reactive } from 'vue';

const globalStore = GlobalStore();
const radarChartTypes = markRaw([
  {
    label: '货物堆形',
    value: 'findWarehouseGoodsPointCloudDataHistogram',
  },
  {
    label: '货物点云',
    value: 'findHandlePointCloudDataHistory',
  },
  {
    label: '仓内全景',
    value: 'findPointCloudDataHistory',
  },
]);
const radarChart = $ref(radarChartTypes[0].value);
const videoHeader = reactive({
  Authorization: 'Bearer ' + globalStore.cameraToken,
  'Access-Control-Allow-Origin': '*',
});

const queryWareHouses = async () => {
  const { data = {} } = await getWareHouseList();
  const { list = [] } = data;
  globalStore.setGlobalState({ wareHouse: list });
};

const queryCameraList = async () => {
  const res = await getCameraList();
  console.log({ res });
};

onMounted(() => {
  queryWareHouses();
  queryCameraList();
});
</script>

<style lang="less" scoped>
#bigscreen {
  background: url('@/assets/images/bg.png') no-repeat center center;
  background-size: cover;

  .bigscreen-header {
    background: url('@/assets/images/title-bg.png') no-repeat;
    background-size: 100% 150%;
  }
}
</style>
