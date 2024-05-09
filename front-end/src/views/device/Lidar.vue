<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getLidarApi" :pagination="false" />
  </div>
</template>

<script setup>
import { getDevicesByWarehouseId } from '@/api/radar';

const props = defineProps({
  warehouse: {
    type: Object,
    default: () => ({}),
  },
});

const proTable = ref();
const columns = reactive([
  {
    prop: 'devId',
    label: '设备ID',
    minWidth: 150,
  },
  {
    prop: 'alias',
    label: '设备名称',
    minWidth: 150,
  },
  {
    prop: 'equipmentTypeDesc',
    label: '设备类型',
    minWidth: 120,
  },
  { prop: 'operation', label: '操作', fixed: 'right', minWidth: 200 },
]);

const getLidarApi = async () => {
  try {
    return await getDevicesByWarehouseId(props.warehouse.kx_warehouse_id);
  } catch (error) {
    console.error(error);
    ElMessage.error('获取数据失败');
  }
};
</script>

<style lang="less" scoped></style>
