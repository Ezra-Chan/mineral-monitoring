<template>
  <el-tree
    ref="treeRef"
    node-key="id"
    default-expand-all
    highlight-current
    :props="defaultProps"
    :data="data"
    :expand-on-click-node="false"
    @node-click="handleNodeClick"
  />
</template>

<script setup>
import { getCompany } from '@/utils/company';
import { getWarehouseListApi } from '@/api/platform';

const emit = defineEmits(['select']);

const defaultProps = {
  label: 'name',
};
let data = $ref([]);
const treeRef = ref();

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
  const { data = {} } = await getWarehouseListApi(
    { page: 1, per_page: 999999 },
    { company_id: company.id },
  );
  return data.results?.map(item => ({ ...item, type: 'warehouse' })) || [];
};

const handleNodeClick = data => {
  emit('select', data);
};

onMounted(() => {
  loadNode();
});
</script>

<style lang="less" scoped></style>
