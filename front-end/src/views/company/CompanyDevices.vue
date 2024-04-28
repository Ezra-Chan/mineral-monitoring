<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList">
      <template #tableHeader>
        <el-button v-auth="'add'" type="primary" :icon="Plus" @click="openDrawer('新增')">
          新增
        </el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();
const proTable = ref();
const columns = reactive([
  {
    prop: 'deviceName',
    label: '设备名称',
    search: { el: 'input', props: { placeholder: '请输入设备名称' } },
    minWidth: 150,
  },
  {
    prop: 'deviceType',
    label: '设备类型',
    minWidth: 80,
  },
  {
    prop: 'belong',
    label: '所属仓库',
    search: { el: 'select', props: { placeholder: '请选择所属仓库' } },
    minWidth: 150,
  },
  {
    prop: 'source',
    label: '设备来源',
    search: { el: 'input', props: { placeholder: '请输入设备来源' } },
    minWidth: 150,
  },
  { prop: 'operation', label: '操作', fixed: 'right', minWidth: 200 },
]);

const getTableList = async params => {
  return [];
};
</script>

<style lang="less" scoped></style>
