<template>
  <el-input v-model="filterText" placeholder="请输入" clearable class="m-b" />
  <el-tree
    ref="treeRef"
    node-key="id"
    default-expand-all
    highlight-current
    :props="defaultProps"
    :data="data"
    :expand-on-click-node="false"
    :filter-node-method="filterNode"
    @node-click="handleNodeClick"
  />
</template>

<script setup>
import { getCompany } from '@/utils/company';
import { getWarehouseListApi } from '@/api/platform';
import { defaultPage } from '@/utils/constant';

const emit = defineEmits(['select']);

const defaultProps = {
  label: 'name',
};
let data = $ref([]);
const treeRef = ref();
const filterText = ref('');

const loadNode = async () => {
  const res = await getCompany();
  const companies = res.map(item => ({ ...item, type: 'company' }));
  const result = await Promise.all(companies.map(loadWarehouse));
  data = companies.map((item, index) => ({ ...item, children: result[index] }));
  if (data.length) {
    const first = data[0];
    nextTick(() => {
      treeRef.value.setCurrentKey(first.id);
      handleNodeClick(first);
    });
  }
};

const loadWarehouse = async company => {
  const { data = {} } = await getWarehouseListApi(defaultPage, { company_id: company.id });
  return data.results?.map(item => ({ ...item, type: 'warehouse' })) || [];
};

const handleNodeClick = data => {
  emit('select', data);
};

const filterNode = (value, data) => {
  if (!value) return true;
  return data.name.includes(value);
};

watch(filterText, val => {
  treeRef.value.filter(val);
});

onMounted(() => {
  loadNode();
});
</script>

<style lang="less" scoped>
:deep(.el-tree-node) {
  font-size: 15px;
  --el-tree-node-content-height: 32px;

  &.is-current > .el-tree-node__content > .el-tree-node__label {
    color: var(--el-color-primary);
  }
}
</style>

<style lang="less">
.dark {
  .el-tree-node.is-current > .el-tree-node__content {
    background-color: var(--el-color-primary-dark-2);
    & > .el-tree-node__label {
      color: var(--el-color-white);
    }
  }
}
</style>
