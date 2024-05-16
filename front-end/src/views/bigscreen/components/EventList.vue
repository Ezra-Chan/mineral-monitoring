<template>
  <el-table
    class="event-list w-full h-full"
    stripe
    :data="dataSource"
    v-loading="loading"
    element-loading-background="#0004"
    :header-row-style="{ background: 'rgba(14, 188, 225, 0.3)', color: 'var(--el-color-primary)' }"
  >
    <el-table-column
      v-for="item in columns"
      :key="item.prop"
      :prop="item.prop"
      :label="item.label"
      :min-width="item.minWidth || 0"
    />
    <el-table-column label="操作" min-width="100" align="center">
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
import { getAllEvents } from '@/api/monitoring';
import { getDeviceList } from '@/api/platform';
import { useGlobalStore } from '@/store/global';
import { useUserStore } from '@/store/user';
import { Decrypt } from '@/utils/AES';
import { defaultPage } from '@/utils/constant';
import { watch } from 'vue';

const columns = [
  {
    prop: 'eventTime',
    label: '时间',
    minWidth: 150,
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
const imgRef = ref(null);
let loading = $ref(false);
let imgLoading = $ref(false);
let dialogVisible = $ref(false);
let imgSrc = $ref('');
let deviceMap = $ref({});
let first = true;
const { toggle } = useFullscreen(imgRef);
const globalStore = useGlobalStore();
const userStore = useUserStore();
const eventListSwitch = useStorage('eventListSwitch', false);

const getEventsList = async () => {
  first && (loading = true);
  try {
    const params = { size: 100 };
    if (eventListSwitch.value) {
      if (!deviceMap[globalStore.currentWareHouse]) {
        const { company_id, id } =
          globalStore.wareHouse.find(w => w.kx_warehouse_id === globalStore.currentWareHouse) || {};
        const { data = {} } = await getDeviceList(defaultPage, {
          company_id,
          warehouse_id: id,
        });
        const record = data.results.map(d => d.monitor_device_path);
        params.cameraId = record;
        deviceMap[globalStore.currentWareHouse] = record;
      } else {
        params.cameraId = deviceMap[globalStore.currentWareHouse];
      }
    }
    const { data = [] } = await getAllEvents(params);
    dataSource.value = data.map(ev => ({
      ...ev,
      eventTime: dayjs(ev.eventTime).format('YYYY-MM-DD HH:mm:ss'),
    }));
  } catch (error) {
  } finally {
    loading = false;
    first = false;
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

useIntervalFn(getEventsList, 10 * 1000, {
  immediateCallback: true,
});

watch(
  () => [eventListSwitch.value, globalStore.currentWareHouse],
  ([newSwitch], [oldSwitch]) => {
    if (newSwitch || newSwitch !== oldSwitch) getEventsList();
  },
);
</script>

<style lang="less">
.event-list {
  &.el-table {
    --el-table-border-color: transparent;
    --el-fill-color-lighter: rgba(14, 188, 225, 0.1);
  }
}
</style>
