<template>
  <div class="w-full h-full flex flex-col gap-4">
    <el-text size="large" class="self-start! font-bold">字典类别</el-text>
    <div class="w-full flex items-center justify-between">
      <el-button
        v-auth="'addType'"
        type="primary"
        size="small"
        :icon="Plus"
        @click="openDialog('新增')"
      >
        新增
      </el-button>
      <el-space v-if="select">
        <el-button
          v-auth="'editType'"
          type="primary"
          size="small"
          :icon="EditPen"
          @click="openDialog('编辑', select)"
        >
          编辑
        </el-button>
        <el-button
          v-auth="'deleteType'"
          type="danger"
          size="small"
          :icon="Delete"
          @click="deleteDictType(select)"
        >
          删除
        </el-button>
      </el-space>
    </div>
    <el-input v-model="filterText" placeholder="请输入" clearable />
    <el-tree
      ref="treeRef"
      class="w-full"
      node-key="id"
      highlight-current
      :props="defaultProps"
      :data="data"
      :filter-node-method="filterNode"
      @node-click="handleNodeClick"
    />
  </div>
  <pro-dialog ref="dialogRef" />
</template>

<script setup>
import { Plus, EditPen, Delete } from '@element-plus/icons-vue';
import {
  getDictTypeApi,
  createDictTypeApi,
  deleteDictTypeApi,
  updateDictTypeApi,
} from '@/api/platform';

const emit = defineEmits(['select']);

const defaultProps = {
  label: 'name_zh',
};
let data = $ref([]);
let select = $ref();
const treeRef = ref();
const filterText = ref('');
const dialogRef = ref();

const formColumns = markRaw([
  {
    formItem: {
      label: '字典类别中文名',
      prop: 'name_zh',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入字典类别中文名',
    },
  },
  {
    formItem: {
      label: '字典类别英文名',
      prop: 'name_en',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入字典类别英文名',
    },
  },
]);

const rules = reactive({
  name_zh: [{ required: true, message: '请输入字典类别中文名', trigger: 'blur' }],
  name_en: [{ required: true, message: '请输入字典类别英文名', trigger: 'blur' }],
});

const createDictType = async row => {
  try {
    await createDictTypeApi(row);
    ElMessage.success('新增成功');
    dialogRef.value.close();
    loadNode();
  } catch (error) {
    console.error(error);
    ElMessage.error(error?.data?.msg || '新增失败');
  }
};

const updateDictType = async row => {
  try {
    await updateDictTypeApi(row.id, objOmit(row, ['id']));
    ElMessage.success('编辑成功');
    dialogRef.value.close();
    loadNode();
  } catch (error) {
    ElMessage.error('编辑失败');
  }
};

const deleteDictType = row => {
  ElMessageBox.confirm(`确定要删除字典类别【${row.name_zh}】吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteDictTypeApi(row.id);
        ElMessage.success('删除成功');
        loadNode();
      } catch (error) {
        ElMessage.error(error?.data?.msg || '删除失败');
      }
    })
    .catch(() => {});
};

const openDialog = (type, row) => {
  const { cloned: record } = useCloned(row || {});
  const isAdd = type === '新增';

  dialogRef.value.acceptParams({
    isView: false,
    width: 520,
    title: type + '字典类别',
    data: record,
    formOptions: {
      labelWidth: '10rem',
      labelSuffix: ' :',
      class: 'overflow-y-auto p-r-8 h-full',
      rules,
      disabled: false,
    },
    formColumns,
    onSubmit: isAdd ? createDictType : updateDictType,
  });
};

const loadNode = async () => {
  const { data: { results = [] } = {} } = await getDictTypeApi();
  data = results;
  if (results.length) {
    const first = results[0];
    nextTick(() => {
      treeRef.value.setCurrentKey(first.id);
      handleNodeClick(first);
    });
  }
};

const handleNodeClick = data => {
  select = data;
  emit('select', data);
};

const filterNode = (value, data) => {
  if (!value) return true;
  return data.name_zh.includes(value);
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
