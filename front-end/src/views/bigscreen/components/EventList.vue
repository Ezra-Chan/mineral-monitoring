<template>
  <el-table
    class="event-list w-full h-full"
    stripe
    :data="dataSource"
    v-loading="loading"
    element-loading-background="#0004"
    :header-row-style="{ background: 'rgba(14, 188, 225, 0.3)' }"
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
          v-if="row.detail"
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
</template>

<script setup>
import dayjs from 'dayjs';
import { getEvents } from '@/api/camera';
import { getAllEvents } from '@/api/monitoring';

const eventTypes = ['车辆越线', '非机动车', '人员越线'];
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
    prop: 'licensePlate',
    label: '明细',
  },
];
const dataSource = ref([]);
let loading = $ref(false);

const getEventsList = async () => {
  loading = true;
  try {
    // const { data = {} } = await getEvents();
    const { data = [] } = await getAllEvents();
    dataSource.value = data.map(ev => ({
      ...ev,
      eventTime: dayjs(ev.eventTime).format('YYYY-MM-DD hh:mm:ss'),
    }));
  } catch (error) {
  } finally {
    loading = false;
  }
};

const handleView = row => {
  console.log(row);
};

useIntervalFn(getEventsList, 10 * 1000, {
  immediateCallback: true,
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
