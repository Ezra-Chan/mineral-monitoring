<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      stripe
      :columns="columns"
      :request-api="queryDict"
      :data-callback="transformData"
    >
      <template #tableHeader>
        <el-button v-auth="'add'" type="primary" :icon="Plus" @click="openDrawer('新增')">
          新增
        </el-button>
      </template>
      <template #operation="scope">
        <el-button
          v-auth="'edit'"
          type="primary"
          link
          :icon="EditPen"
          :disabled="scope.row.source !== userInfo.company_id"
          @click="openDrawer('编辑', scope.row)"
        >
          编辑
        </el-button>
        <el-button
          v-auth="'delete'"
          type="danger"
          link
          :icon="Delete"
          :disabled="scope.row.source !== userInfo.company_id"
          @click="deleteDictionary(scope.row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <ProDrawer ref="drawerRef" />
  </div>
</template>

<script setup>
import { Plus, EditPen, Delete } from '@element-plus/icons-vue';
import {
  createDictionaryApi,
  updateDictionaryApi,
  deleteDictionaryApi,
  getDictionaryListApi,
} from '@/api/platform';
import { objOmit } from '@/utils';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const { userInfo } = $(userStore);

const proTable = ref();
const drawerRef = ref();
const columns = reactive([
  {
    prop: 'name_zh',
    label: '字典中文名称',
    search: { el: 'input', props: { placeholder: '请输入字典中文名称' } },
    minWidth: 150,
  },
  {
    prop: 'name_en',
    label: '字典英文名称',
    search: { el: 'input', props: { placeholder: '请输入字典英文名称' } },
    minWidth: 150,
  },
  {
    prop: 'key',
    label: '字典键',
    search: { el: 'input', props: { placeholder: '请输入字典键' } },
    minWidth: 150,
  },
  {
    prop: 'value',
    label: '字典值',
    search: { el: 'input', props: { placeholder: '请输入字典值' } },
    minWidth: 150,
  },
  { prop: 'operation', label: '操作', fixed: 'right', minWidth: 200 },
]);
const formColumns = markRaw([
  {
    formItem: {
      label: '字典中文名称',
      prop: 'name_zh',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入字典中文名称',
    },
  },
  {
    formItem: {
      label: '字典英文名称',
      prop: 'name_en',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入字典英文名称',
    },
  },
  {
    formItem: {
      label: '字典键',
      prop: 'key',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入字典键',
    },
  },
  {
    formItem: {
      label: '字典值',
      prop: 'value',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入字典值',
    },
  },
]);
const rules = reactive({
  name_zh: [{ required: true, message: '请输入字典中文名称', trigger: 'blur' }],
  name_en: [{ required: true, message: '请输入字典英文名称', trigger: 'blur' }],
  key: [{ required: true, message: '请输入字典键', trigger: 'blur' }],
  value: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
});

const createDictionary = async row => {
  try {
    await createDictionaryApi({ ...row, source: userInfo.company_id });
    ElMessage.success('新增成功');
    drawerRef.value.close();
    proTable.value.search();
  } catch (error) {
    ElMessage.error('新增失败');
  }
};

const updateDictionary = async row => {
  try {
    await updateDictionaryApi(row.id, objOmit(row, ['id']));
    ElMessage.success('编辑成功');
    drawerRef.value.close();
    proTable.value.search();
  } catch (error) {
    ElMessage.error('编辑失败');
  }
};

const deleteDictionary = row => {
  ElMessageBox.confirm(`确定要删除字典【${row.name_zh}】中的 【${row.value}】吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteDictionaryApi(row.id);
        ElMessage.success('删除成功');
        proTable.value.search();
      } catch (error) {
        ElMessage.error('删除失败');
      }
    })
    .catch(() => {});
};

const openDrawer = async (type, row) => {
  const { cloned: record } = useCloned(row || {});
  const isAdd = type === '新增';
  const isView = type === '查看';

  drawerRef.value.acceptParams({
    isView,
    size: '500px',
    title: type + '字典',
    data: record,
    formOptions: {
      labelWidth: '10rem',
      labelSuffix: ' :',
      class: 'overflow-y-auto p-r-8 h-full',
      rules,
      disabled: isView,
    },
    formColumns,
    onSubmit: isAdd ? data => createDictionary(data) : data => updateDictionary(data),
  });
};

const queryDict = async (params, data) => {
  return await getDictionaryListApi(params, { ...data, source: userInfo.company_id });
};

const transformData = data => ({
  list: data.results,
  total: data.total,
});
</script>

<style lang="less" scoped></style>
