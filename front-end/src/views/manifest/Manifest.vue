<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      stripe
      :columns="columns"
      :request-api="queryMenifest"
      :data-callback="transformData"
    >
      <template #operation="scope">
        <el-button
          v-auth="'view'"
          type="success"
          link
          :icon="View"
          @click="openDrawer('查看', scope.row)"
        >
          查看
        </el-button>
        <el-button
          v-auth="'edit'"
          type="primary"
          link
          :icon="EditPen"
          @click="openDrawer('编辑', scope.row)"
        >
          编辑
        </el-button>
        <el-button
          v-auth="'delete'"
          type="danger"
          link
          :icon="Delete"
          @click="deleteMenifest(scope.row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <ProDrawer ref="drawerRef" />
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { EditPen, Delete, View } from '@element-plus/icons-vue';
import { updateMenifestApi, deleteMenifestApi, getMenifestListApi } from '@/api/platform';
import { objOmit } from '@/utils';
import { IE_TYPE } from '@/utils/constant';
import { useUserStore } from '@/store/user';
import { useDictStore } from '@/store/dictionary';

const dictStore = useDictStore();
const userStore = useUserStore();
const { warehouses = [] } = $(userStore);
const { dict = {} } = $(dictStore);

const warehouseMap = computed(() => [
  ...new Set(warehouses.map(w => dict.ERP?.[w.name] ?? w.name)),
]);
const goodsMap = computed(
  () =>
    [
      ...new Set(
        dict.GOODS_TYPE?.ORIGIN_ENUM?.map(t => {
          const name = dict.ERP?.[t.label] || t.label;
          return {
            label: name,
            value: name,
          };
        }),
      ),
    ] || [],
);

const proTable = ref();
const drawerRef = ref();
const columns = reactive([
  {
    prop: 'bar_code',
    label: '出运单号',
    search: { el: 'input', props: { placeholder: '请输入出运单号' } },
    minWidth: 150,
  },
  {
    prop: 'goods_name',
    label: '货物',
    search: {
      el: 'select',
      props: { placeholder: '请输入货物', filterable: true, multiple: true },
    },
    enum: goodsMap.value,
    minWidth: 150,
  },
  {
    prop: 'warehouse_name',
    label: '仓库',
    search: {
      el: 'select',
      props: { placeholder: '请选择仓库', filterable: true, multiple: true },
    },
    enum: warehouseMap.value.map(w => ({ label: w, value: w })),
    minWidth: 150,
  },
  {
    prop: 'ie_type',
    label: '出入库类型',
    tag: true,
    enum: IE_TYPE,
    search: { el: 'select', props: { placeholder: '请选择出入库类型', filterable: true } },
    minWidth: 150,
  },
  {
    prop: 'quantity',
    label: '数量',
    minWidth: 150,
  },
  {
    prop: 'operate_time',
    label: '操作时间',
    minWidth: 200,
  },
  { prop: 'operation', label: '操作', fixed: 'right', minWidth: 220 },
]);
const formColumns = markRaw([
  {
    formItem: {
      label: '出运单号',
      prop: 'bar_code',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入出运单号',
    },
  },
  {
    formItem: {
      label: '车牌号',
      prop: 'license_plate',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入车牌号',
    },
  },
  {
    formItem: {
      label: '货物',
      prop: 'goods_name',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入货物',
    },
  },
  {
    formItem: {
      label: '仓库',
      prop: 'warehouse_name',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入仓库',
    },
  },
  {
    formItem: {
      label: '出入库类型',
      prop: 'ie_type',
    },
    component: 'el-select',
    attrs: {
      clearable: true,
      placeholder: '请选择出入库类型',
      filterable: true,
    },
    children: IE_TYPE.map(item => ({
      component: 'el-option',
      attrs: item,
    })),
  },
  {
    formItem: {
      label: '数量',
      prop: 'quantity',
    },
    component: 'el-input-number',
    attrs: {
      clearable: true,
      placeholder: '请输入数量',
      controlsPosition: 'right',
      class: 'w-100%!',
      precision: 2,
    },
  },
  {
    formItem: {
      label: '操作时间',
      prop: 'operate_time',
    },
    component: 'el-date-picker',
    attrs: {
      clearable: true,
      type: 'datetime',
      placeholder: '请选择操作时间',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      style: {
        width: '100%',
      },
    },
  },
]);
const rules = reactive({
  bar_code: [{ required: true, message: '请输入出运单号', trigger: 'blur' }],
  goods_name: [{ required: true, message: '请输入货物名称', trigger: 'blur' }],
  warehouse_name: [{ required: true, message: '请选择仓库', trigger: 'blur' }],
  ie_type: [{ required: true, message: '请输入出入库类型', trigger: 'blur' }],
  quantity: [{ required: true, message: '请输入数量', trigger: 'blur' }],
  operate_time: [{ required: true, message: '请选择操作时间', trigger: 'blur' }],
});

const updateMenifest = async row => {
  try {
    await updateMenifestApi(row.id, objOmit(row, ['id']));
    ElMessage.success('编辑成功');
    drawerRef.value.close();
    proTable.value.search();
  } catch (error) {
    ElMessage.error('编辑失败');
  }
};

const deleteMenifest = row => {
  ElMessageBox.confirm(`确定要删除货单【${row.bar_code}】吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteMenifestApi(row.id);
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
  const isView = type === '查看';

  drawerRef.value.acceptParams({
    isView,
    size: '500px',
    title: type + '货单',
    data: record,
    formOptions: {
      labelWidth: '10rem',
      labelSuffix: ' :',
      class: 'overflow-y-auto p-r-8 h-full',
      rules,
      disabled: isView,
    },
    formColumns,
    onSubmit: updateMenifest,
  });
};

const queryMenifest = async (params, data = {}) => {
  if (!data.warehouse_name || !data.warehouse_name.length) {
    data.warehouse_name = warehouseMap.value;
  }
  return await getMenifestListApi(params, data);
};

const handleRecord = record => ({
  ...record,
  operate_time: dayjs(record.operate_time).format('YYYY-MM-DD HH:mm:ss'),
});

const transformData = data => ({
  list: data.results.map(handleRecord),
  total: data.total,
});
</script>

<style lang="less" scoped></style>
