<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getWarehouseListApi"
      :data-callback="transformData"
    >
      <template #tableHeader>
        <el-button v-auth="'add'" type="primary" :icon="Plus" @click="openDrawer('新增')">
          新增
        </el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">
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
        <el-popconfirm title="确认删除吗？" v-auth="'delete'" @confirm="deleteWarehouse(scope.row)">
          <template #reference>
            <el-button type="primary" link :icon="Delete"> 删除 </el-button>
          </template>
        </el-popconfirm>
      </template>
    </ProTable>
    <ProDrawer ref="drawerRef" />
  </div>
</template>

<script setup>
import { Plus, View, EditPen, Delete } from '@element-plus/icons-vue';
import {
  getWarehouseListApi,
  createWarehouseApi,
  updateWarehouseApi,
  deleteWarehouseApi,
} from '@/api/platform';
import { objOmit } from '@/utils';
import { WarehouseStatus } from '@/utils/constant';
import cities from '@/utils/pca-code.json';

const router = useRouter();
const proTable = ref();
const drawerRef = ref();
const columns = reactive([
  {
    prop: 'name',
    label: '仓库名称',
    search: { el: 'input', props: { placeholder: '请输入仓库名称' } },
    minWidth: 250,
  },
  {
    prop: 'company',
    label: '所属公司',
    search: { el: 'select', props: { placeholder: '请输入所属公司' } },
    minWidth: 100,
  },
  {
    prop: 'manager',
    label: '管理员',
    search: { el: 'select', props: { placeholder: '请输入管理员' } },
    minWidth: 120,
  },
  {
    prop: 'location',
    label: '仓库地址',
    minWidth: 250,
  },
  {
    prop: 'width',
    label: '仓库宽度',
    minWidth: 120,
  },
  {
    prop: 'height',
    label: '仓库高度',
    minWidth: 120,
  },
  {
    prop: 'length',
    label: '仓库长度',
    minWidth: 120,
  },
  {
    prop: 'capacity',
    label: '仓库容量',
    minWidth: 120,
  },
  {
    prop: 'stacking_limit',
    label: '仓库堆放限高',
    minWidth: 120,
  },
  {
    prop: 'status',
    label: '仓库状态',
    enum: WarehouseStatus,
    search: { el: 'select', props: { placeholder: '请选择仓库状态', filterable: true } },
    minWidth: 100,
  },
  { prop: 'operation', label: '操作', fixed: 'right', minWidth: 220 },
]);
const formColumns = markRaw([
  {
    formItem: {
      label: '仓库名称',
      prop: 'name',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入仓库名称',
    },
  },
  {
    formItem: {
      label: '仓库地址',
      prop: 'location',
    },
    component: 'el-cascader',
    attrs: {
      clearable: true,
      filterable: true,
      placeholder: '请输入仓库地址',
      props: {
        value: 'name',
        label: 'name',
      },
      options: cities,
      class: 'w-100%',
    },
  },
  {
    formItem: {
      label: '仓库经纬度',
      prop: 'lat_lng',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入仓库经纬度',
    },
  },
  {
    formItem: {
      label: '仓库宽度',
      prop: 'width',
    },
    component: 'el-input-number',
    attrs: {
      clearable: true,
      placeholder: '请输入仓库宽度',
      controlsPosition: 'right',
      class: 'w-100%!',
      precision: 2,
    },
  },
  {
    formItem: {
      label: '仓库高度',
      prop: 'height',
    },
    component: 'el-input-number',
    attrs: {
      clearable: true,
      placeholder: '请输入仓库高度',
      controlsPosition: 'right',
      precision: 2,
      class: 'w-100%!',
    },
  },
  {
    formItem: {
      label: '仓库长度',
      prop: 'length',
    },
    component: 'el-input-number',
    attrs: {
      clearable: true,
      placeholder: '请输入仓库长度',
      controlsPosition: 'right',
      class: 'w-100%!',
      precision: 2,
    },
  },
  {
    formItem: {
      label: '仓库容量',
      prop: 'capacity',
    },
    component: 'el-input-number',
    attrs: {
      clearable: true,
      placeholder: '请输入仓库容量',
      controlsPosition: 'right',
      class: 'w-100%!',
      precision: 2,
    },
  },
  {
    formItem: {
      label: '堆放限高',
      prop: 'stacking_limit',
    },
    component: 'el-input-number',
    attrs: {
      clearable: true,
      placeholder: '请输入堆放限高',
      controlsPosition: 'right',
      class: 'w-100%!',
      precision: 2,
    },
  },
  {
    formItem: {
      label: '仓库状态',
      prop: 'status',
    },
    component: 'el-select',
    attrs: {
      clearable: true,
      placeholder: '请选择仓库状态',
      filterable: true,
    },
    children: WarehouseStatus.map(item => ({
      component: 'el-option',
      attrs: item,
    })),
  },
  {
    formItem: {
      label: '所属公司',
      prop: 'company',
    },
    component: 'el-select',
    attrs: {
      clearable: true,
      filterable: true,
      placeholder: '请选择所属公司',
    },
  },
  {
    formItem: {
      label: '仓库管理员',
      prop: 'manager',
    },
    component: 'el-select',
    attrs: {
      clearable: true,
      filterable: true,
      placeholder: '请选择仓库管理员',
    },
  },
]);
const rules = reactive({
  name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
  location: [{ required: true, message: '请输入仓库地址', trigger: 'blur' }],
  width: [{ required: true, message: '请输入仓库宽度', trigger: 'blur' }],
  height: [{ required: true, message: '请输入仓库高度', trigger: 'blur' }],
  length: [{ required: true, message: '请输入仓库长度', trigger: 'blur' }],
  capacity: [{ required: true, message: '请输入仓库容量', trigger: 'blur' }],
  stacking_limit: [{ required: true, message: '请输入堆放限高', trigger: 'blur' }],
});

const createWarehouse = async row => {
  try {
    await createWarehouseApi({ ...row, location: row.location.join(',') });
    ElMessage.success('新增成功');
    drawerRef.value.close();
    proTable.value.search();
  } catch (error) {
    ElMessage.error('新增失败');
  }
};

const updateWarehouse = async row => {
  try {
    await updateWarehouseApi(row.id, objOmit({ ...row, location: row.location.join('/') }, ['id']));
    ElMessage.success('编辑成功');
    drawerRef.value.close();
    proTable.value.search();
  } catch (error) {
    ElMessage.error('编辑失败');
  }
};

const deleteWarehouse = async row => {
  try {
    await ElMessageBox.confirm(`确定要删除仓库【${row.name}】吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await deleteWarehouseApi(row.id);
    ElMessage.success('删除成功');
    proTable.value.search();
  } catch (error) {
    ElMessage.error('删除失败');
  }
};

const openDrawer = (type, row) => {
  const isAdd = type === '新增';
  const isEdit = type === '编辑';
  const isView = type === '查看';
  drawerRef.value.acceptParams({
    isView,
    size: '500px',
    title: type + '仓库',
    data: row
      ? { ...row, location: row?.location ? row.location.split('/') : [] }
      : {
          status: 1,
        },
    formOptions: {
      labelWidth: '10rem',
      labelSuffix: ' :',
      class: 'overflow-y-auto p-r-8 h-full',
      rules,
      disabled: isView,
    },
    formColumns,
    onSubmit: isAdd ? data => createWarehouse(data) : data => updateWarehouse(data),
  });
};

const transformData = data => ({
  list: data.results,
  total: data.total,
});
</script>

<style lang="less" scoped></style>
