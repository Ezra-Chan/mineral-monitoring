<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getCameraApi" :pagination="false" />
  </div>
</template>

<script setup>
import { getDeviceList } from '@/api/platform';
import { getCameraList } from '@/api/camera';

const props = defineProps({
  warehouse: {
    type: Object,
    default: () => ({}),
  },
});

const proTable = ref();
const columns = reactive([
  {
    prop: 'monitor_device_id',
    label: '设备ID',
    minWidth: 150,
  },
  {
    prop: 'monitor_device_name',
    label: '设备名称',
    minWidth: 150,
  },
  {
    prop: 'status',
    label: '设备状态',
    minWidth: 100,
  },
  {
    prop: 'accessPoint',
    label: '访问路径',
    minWidth: 200,
  },
  { prop: 'operation', label: '操作', fixed: 'right', minWidth: 200 },
]);

const getCameraApi = async () => {
  try {
    const [{ data: device }, { data: camera }] = await Promise.all([
      getDeviceList(
        {
          page: 1,
          per_page: 999999,
        },
        {
          warehouse_id: props.warehouse.id,
        },
      ),
      getCameraList(),
    ]);
    console.log(device, camera);
  } catch (error) {
    console.error(error);
    ElMessage.error('获取数据失败');
  }
};
</script>

<style lang="less" scoped></style>
