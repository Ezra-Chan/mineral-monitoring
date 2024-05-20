<template>
  <div
    class="w-full h-full flex flex-col justify-between items-center gap-2"
    v-loading="loading"
    element-loading-background="#0004"
  >
    <div class="w-full h-25" ref="eventTypeRef" v-element-size="onResize" />
    <el-table
      class="event-list w-full h-calc-6.75!"
      stripe
      :data="dataSource"
      :header-row-style="{
        background: 'rgba(14, 188, 225, 0.3)',
        color: 'var(--el-color-primary)',
      }"
    >
      <el-table-column
        v-for="item in columns"
        :key="item.prop"
        :prop="item.prop"
        :label="item.label"
        :min-width="item.minWidth || 0"
      />
      <el-table-column label="操作" min-width="90" align="center">
        <template #default="{ row }">
          <el-text
            v-if="row.cameraId"
            type="primary"
            class="cursor-pointer"
            size="small"
            @click="handleView(row)"
          >
            查看
          </el-text>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <el-dialog v-model="dialogVisible" title="关键画面" width="1000" :before-close="handleClose">
    <div class="w-full h-xl" v-loading="imgLoading" element-loading-background="rgba(0, 0, 0, 0.8)">
      <img
        v-if="imgSrc"
        ref="imgRef"
        alt=""
        class="w-full h-full object-contain"
        :src="imgSrc"
        @dblclick="toggle"
      />
    </div>
  </el-dialog>
</template>

<script setup>
import dayjs from 'dayjs';
import * as echarts from 'echarts';
import { getAllEvents } from '@/api/monitoring';
import { getDeviceList } from '@/api/platform';
import { useGlobalStore } from '@/store/global';
import { useUserStore } from '@/store/user';
import { Decrypt } from '@/utils/AES';
import { defaultPage } from '@/utils/constant';

const emits = defineEmits(['update']);

const columns = [
  {
    prop: 'eventTime',
    label: '时间',
    minWidth: 160,
  },
  {
    prop: 'eventName',
    label: '事件',
  },
  {
    prop: 'position',
    label: '位置',
    minWidth: 150,
  },
];
const dataSource = ref([]);
const eventTypeRef = ref(null);
const myChart = ref(null);
const imgRef = ref(null);
let loading = $ref(false);
let imgLoading = $ref(false);
let dialogVisible = $ref(false);
let imgSrc = $ref('');
let deviceMap = $ref({});
const types = ref({});
const cameraIds = ref([]);
const colors = ['#fbc292', '#06fbfe', '#A098FC', '#4386FA'];
const { toggle } = useFullscreen(imgRef);
const globalStore = useGlobalStore();
const userStore = useUserStore();
const eventListSwitch = useStorage('eventListSwitch', false);

const getCameraIds = async () => {
  if (!deviceMap[globalStore.currentWareHouse]?.length) {
    const { company_id, id } =
      globalStore.wareHouse.find(w => w.kx_warehouse_id === globalStore.currentWareHouse) || {};
    const { data = {} } = await getDeviceList(defaultPage, {
      company_id,
      warehouse_id: id,
    });
    const record = data.results.map(d => d.monitor_device_path);
    cameraIds.value = record;
    deviceMap[globalStore.currentWareHouse] = record;
  } else {
    cameraIds.value = deviceMap[globalStore.currentWareHouse];
  }
};

const getEventsList = async (needLoading = true) => {
  needLoading && (loading = true);
  try {
    const params = { size: 100, eventTime: dayjs().format('YYYY-MM-DD 00:00:00') };
    if (eventListSwitch.value) {
      params.cameraId = cameraIds.value;
    }
    const { data = [] } = await getAllEvents(params);
    const typeMap = {
      区域进入: 0,
      人员出入: 0,
      车辆出入: 0,
      total: 0,
    };
    const today = dayjs().format('YYYY-MM-DD');
    dataSource.value = data.map(ev => {
      const { eventTime, eventName } = ev;
      const formatTime = dayjs(eventTime).format('YYYY-MM-DD HH:mm:ss');
      if (formatTime.startsWith(today)) {
        typeMap[eventName]++;
        typeMap.total++;
      }
      return {
        ...ev,
        eventTime: formatTime,
      };
    });
    types.value = typeMap;
    emits('update', typeMap.total);
  } catch (error) {
    console.error(error);
  } finally {
    needLoading && (loading = false);
  }
};

const onResize = () => myChart.value?.resize();

const setOptions = () => {
  if (myChart.value) {
    const typeArr = ['区域进入', '人员出入', '车辆出入'];
    let series = [];
    typeArr.forEach((type, index) => {
      const current = types.value[type];
      const left = types.value.total - current;
      series = [
        ...series,
        ...[
          {
            type: 'pie',
            name: type,
            radius: ['65%', '80%'],
            center: [`${index * 33.33 + 16.66}%`, '40%'],
            hoverAnimation: false,
            data: [
              {
                value: types.value[type],
                label: {
                  normal: {
                    show: true,
                    position: 'center',
                    formatter: '{d}%',
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: colors[index],
                  },
                },
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                      {
                        offset: 0,
                        color: colors[index],
                      },
                      {
                        offset: 1,
                        color: colors[index + 1],
                      },
                    ]),
                  },
                },
              },
              {
                value: left === 0 && current === 0 ? 1 : left,
                name: 'invisible',
                labelLine: {
                  show: false,
                },
                label: {
                  show: false,
                },
                itemStyle: {
                  normal: {
                    color: '#ddd2',
                  },
                },
              },
            ],
          },
        ],
      ];
    });
    myChart.value.setOption({
      title: typeArr.map((type, index) => ({
        text: `${type}: ${types.value[type]}`,
        left: index * 33.33 + 16.66 + '%',
        bottom: -5,
        textAlign: 'center',
        textStyle: {
          fontWeight: 'normal',
          fontSize: 14,
          color: '#1DF7FF',
          textAlign: 'center',
        },
      })),
      series,
    });
  }
};

const checkImage = (urls, i, callback) => {
  const { u, p } = userStore.monitorUser || {};
  fetch(urls[i], {
    headers: {
      Authorization: 'Basic ' + btoa(`${u}:${Decrypt(p)}`),
    },
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob(); // 将响应转换为 Blob 对象
    })
    .then(blob => {
      // 在这里处理 Blob 对象，例如显示图片
      const imageUrl = URL.createObjectURL(blob);
      callback(true, imageUrl);
    })
    .catch(() => {
      if (i === 0) {
        checkImage(urls, 1, callback);
      } else {
        callback(false);
      }
    });
};

const handleView = row => {
  dialogVisible = true;
  imgLoading = true;
  const { cameraId, eventTime } = row;
  const time = dayjs(eventTime).subtract(8, 'hours').format('YYYYMMDDTHHmmss');
  const src = `${userStore.companyInfo.monitor_ip}/archive/media${cameraId.replace('hosts', '')}`;
  const srcArr = [`${src}/${time}`, `${src.replace(/:0$/, ':1')}/${time}`];
  checkImage(srcArr, 0, (flag, data) => {
    if (flag) {
      imgSrc = data;
    }
    imgLoading = false;
  });
};

const handleClose = () => {
  dialogVisible = false;
  const timer = setTimeout(() => {
    imgSrc = '';
    clearTimeout(timer);
  }, 100);
};

useIntervalFn(() => getEventsList(false), 10 * 1000);

watch(
  () => [eventListSwitch.value, globalStore.currentWareHouse],
  ([newSwitch] = [], [oldSwitch] = []) => {
    if (newSwitch) {
      getCameraIds();
    } else if (newSwitch !== oldSwitch) {
      getEventsList();
    }
  },
  { immediate: true },
);

watch(
  () => [eventListSwitch.value, cameraIds.value],
  ([newSwitch]) => {
    if (newSwitch) {
      getEventsList();
    }
  },
);

watch(types, () => setOptions());

onMounted(() => {
  myChart.value = echarts.init(eventTypeRef.value);
});
</script>

<style lang="less">
.event-list {
  &.el-table {
    --el-table-border-color: transparent;
    --el-fill-color-lighter: rgba(14, 188, 225, 0.1);
  }
}
</style>
