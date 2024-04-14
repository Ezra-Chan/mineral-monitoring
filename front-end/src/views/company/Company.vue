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
const proTable = ref();
const columns = reactive([
  {
    prop: 'name',
    label: '公司名称',
    search: { el: 'input', props: { placeholder: '请输入公司名称' } },
    minWidth: 150,
  },
  {
    prop: 'abbreviation',
    label: '公司简称',
    minWidth: 100,
  },
  {
    prop: 'address',
    label: '公司地址',
    search: { el: 'input', props: { placeholder: '请输入公司地址' } },
    minWidth: 150,
  },
  {
    prop: 'creditCode',
    label: '统一社会信用代码',
    search: { el: 'input', props: { placeholder: '请输入统一社会信用代码' } },
    minWidth: 150,
  },
  {
    prop: 'manager.name',
    label: '公司管理员',
    search: { el: 'input', props: { placeholder: '请输入公司管理员' } },
    minWidth: 100,
  },
  {
    prop: 'createTime',
    label: '成立时间',
    minWidth: 150,
  },
  {
    prop: 'status',
    label: '公司状态',
    search: { el: 'input', props: { placeholder: '请输入公司状态' } },
    minWidth: 100,
  },
  { prop: 'operation', label: '操作', fixed: 'right', minWidth: 200 },
]);

const getTableList = async params => {
  return [];
};
</script>

<style lang="less" scoped></style>
