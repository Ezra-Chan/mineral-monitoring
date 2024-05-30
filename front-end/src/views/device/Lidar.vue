<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      stripe
      :columns="columns"
      :request-api="getLidarApi"
      :pagination="false"
    />
  </div>
</template>

<script setup>
import { getDevicesByWarehouseId, getDeviceConnectStatus } from '@/api/radar';

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
  {
    prop: 'status',
    label: '设备状态',
    minWidth: 120,
  },
  // { prop: 'operation', label: '操作', fixed: 'right', minWidth: 200 },
]);

const getLidarApi = async () => {
  try {
    const { data = [] } = await getDevicesByWarehouseId(props.warehouse.kx_warehouse_id);
    const status = await Promise.all(data.map(item => getDeviceConnectStatus(item.devId)));
    return {
      data: data.map((item, index) => ({
        ...item,
        alias: item.alias || void 0,
        status: status[index]?.data?.connectStatusDesc,
      })),
    };
  } catch (error) {
    console.error(error);
    ElMessage.error('获取数据失败');
  }
};
</script>

<style lang="less" scoped></style>
