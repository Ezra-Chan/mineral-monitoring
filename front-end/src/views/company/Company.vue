<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList"></ProTable>
  </div>
</template>

<script setup>
const router = useRouter();
const proTable = ref();
const columns = reactive([
  {
    prop: 'name',
    label: '公司名称',
    search: { el: 'input' },
  },
  {
    prop: 'abbreviation',
    label: '公司简称',
  },
  {
    prop: 'address',
    label: '公司地址',
    search: { el: 'input' },
  },
  {
    prop: 'creditCode',
    label: '统一社会信用代码',
    search: { el: 'input' },
  },
  {
    prop: 'manager.name',
    label: '公司管理员',
    search: { el: 'input' },
  },
  {
    prop: 'createTime',
    label: '成立时间',
  },
  {
    prop: 'status',
    label: '公司状态',
    search: { el: 'input' },
  },
  { prop: 'operation', label: '操作', fixed: 'right', width: 330 },
]);

const getTableList = async params => {
  return [];
};
</script>

<style lang="less" scoped></style>
