<template>
  <div class="flex gap-3 h-full">
    <div class="card w-80">
      <DictionaryTypeTree @select="handleSelect" />
    </div>
    <div class="card flex-1 flex flex-col gap-2 table-box">
      <ProTable
        ref="proTable"
        stripe
        v-if="select"
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
      <pro-dialog ref="dialogRef" />
    </div>
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
import { useDictStore } from '@/store/dictionary';
import DictionaryTypeTree from './DictionaryTypeTree.vue';

const dictStore = useDictStore();
const userStore = useUserStore();
const { userInfo } = $(userStore);

const proTable = ref();
const dialogRef = ref();
let select = $ref();
const columns = reactive([
  {
    prop: 'key',
    label: '字典键',
    search: { el: 'input', props: { placeholder: '请输入字典键' } },
    minWidth: 280,
  },
  {
    prop: 'value',
    label: '字典值',
    search: { el: 'input', props: { placeholder: '请输入字典值' } },
    minWidth: 280,
  },
  { prop: 'operation', label: '操作', fixed: 'right', minWidth: 180 },
]);
const formColumns = markRaw([
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
  key: [{ required: true, message: '请输入字典键', trigger: 'blur' }],
  value: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
});

const handleSelect = node => {
  select = node;
  nextTick(() => {
    proTable.value.search();
  });
};

const createDictionary = async row => {
  try {
    await createDictionaryApi({ ...row, name_en: select.name_en, source: userInfo.company_id });
    ElMessage.success('新增成功');
    dialogRef.value.close();
    proTable.value.search();
    dictStore.getDictionary();
  } catch (error) {
    console.error(error);
    ElMessage.error(error?.data?.msg || '新增失败');
  }
};

const updateDictionary = async row => {
  try {
    await updateDictionaryApi(row.id, objOmit(row, ['id']));
    ElMessage.success('编辑成功');
    dialogRef.value.close();
    proTable.value.search();
    dictStore.getDictionary();
  } catch (error) {
    ElMessage.error('编辑失败');
  }
};

const deleteDictionary = row => {
  ElMessageBox.confirm(`确定要删除字典【${row.value}】吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteDictionaryApi(row.id);
        ElMessage.success('删除成功');
        proTable.value.search();
        dictStore.getDictionary();
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

  dialogRef.value.acceptParams({
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
    onSubmit: isAdd ? createDictionary : updateDictionary,
  });
};

const queryDict = async (params, data) => {
  return select
    ? await getDictionaryListApi(params, {
        ...data,
        name_en: select.name_en,
        source: userInfo.company_id,
      })
    : {
        data: { results: [] },
      };
};

const transformData = data => ({
  list: data.results,
  total: data.total,
});
</script>

<style lang="less" scoped></style>
