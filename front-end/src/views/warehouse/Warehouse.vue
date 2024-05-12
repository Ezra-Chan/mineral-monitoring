<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getWarehouseList"
      :data-callback="transformData"
    >
      <template #tableHeader>
        <el-button
          v-auth="'sync'"
          type="primary"
          :icon="Refresh"
          :loading="syncLoding"
          @click="syncWarehouse"
        >
          同步
        </el-button>
        <el-button v-auth="'add'" type="primary" :icon="Plus" @click="openDrawer('新增')">
          新增
        </el-button>
      </template>
      <template #operation="scope">
        <el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">
          查看
        </el-button>
        <el-button
          v-auth="'scanView'"
          type="primary"
          link
          :icon="EditPen"
          :loading="scanLoding[scope.row.id]"
          @click="openDrawer('扫描', scope.row)"
        >
          扫描计划
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
          @click="deleteWarehouse(scope.row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <ProDrawer ref="drawerRef" />
  </div>
</template>

<script setup>
import { Plus, View, EditPen, Delete, Refresh } from '@element-plus/icons-vue';
import {
  createWarehouseApi,
  updateWarehouseApi,
  deleteWarehouseApi,
  syncWarehouseApi,
} from '@/api/platform';
import { getWarehouseScanPlan, updateWarehouseScanPlan } from '@/api/radar';
import { objOmit } from '@/utils';
import { WarehouseStatus } from '@/utils/constant';
import cities from '@/utils/pca-code.json';
import { getCompany } from '@/utils/company';
import { getWarehouseList } from '@/utils/warehouse';
import { useUserStore } from '@/store/user';
import { useAuthButtons } from '@/hooks/useAuthButtons';

const userStore = useUserStore();
const { BUTTONS } = useAuthButtons();
const proTable = ref();
const drawerRef = ref();
let syncLoding = $ref(false);
let scanLoding = $ref([]);
const companies = ref([]);
const columns = reactive([
  {
    prop: 'name',
    label: '仓库名称',
    search: { el: 'input', props: { placeholder: '请输入仓库名称' } },
    minWidth: 200,
  },
  {
    prop: 'company_name',
    label: '所属公司',
    minWidth: 250,
  },
  {
    prop: 'location',
    label: '仓库地址',
    minWidth: 250,
  },
  {
    prop: 'goodsTypeDesc',
    label: '货物类型',
    minWidth: 150,
  },
  {
    prop: 'status',
    label: '仓库状态',
    enum: WarehouseStatus,
    search: { el: 'select', props: { placeholder: '请选择仓库状态', filterable: true } },
    minWidth: 100,
  },
  {
    prop: 'width',
    label: '仓库宽度(m)',
    minWidth: 120,
  },
  {
    prop: 'height',
    label: '仓库高度(m)',
    minWidth: 120,
  },
  {
    prop: 'length',
    label: '仓库长度(m)',
    minWidth: 120,
  },
  {
    prop: 'capacity',
    label: '仓库容量(吨)',
    minWidth: 120,
  },
  { prop: 'operation', label: '操作', fixed: 'right', minWidth: 220 },
]);
const formColumns = computed(() => [
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
      label: '仓库宽度(m)',
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
      label: '仓库高度(m)',
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
      label: '仓库长度(m)',
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
      label: '仓库容量(吨)',
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
      prop: 'company_id',
    },
    component: 'el-select',
    attrs: {
      clearable: true,
      filterable: true,
      placeholder: '请选择所属公司',
    },
    children: companies.value?.map(item => ({
      component: 'el-option',
      attrs: {
        label: item.name,
        value: item.id,
      },
    })),
  },
  // {
  //   formItem: {
  //     label: '仓库管理员',
  //     prop: 'manager',
  //   },
  //   component: 'el-select',
  //   attrs: {
  //     clearable: true,
  //     filterable: true,
  //     placeholder: '请选择仓库管理员',
  //   },
  // },
]);
const rules = reactive({
  name: [{ required: true, message: '请输入仓库名称', trigger: 'blur' }],
  location: [{ required: true, message: '请输入仓库地址', trigger: 'blur' }],
  width: [{ required: true, message: '请输入仓库宽度', trigger: 'blur' }],
  height: [{ required: true, message: '请输入仓库高度', trigger: 'blur' }],
  length: [{ required: true, message: '请输入仓库长度', trigger: 'blur' }],
  capacity: [{ required: true, message: '请输入仓库容量', trigger: 'blur' }],
  company_id: [{ required: true, message: '请选择所属公司', trigger: 'blur' }],
});
const scanFormColumns = [
  {
    formItem: {
      label: '扫描周期(分钟)',
      prop: 'startTimeSpan',
    },
    component: 'el-input-number',
    attrs: {
      clearable: true,
      placeholder: '请输入扫描周期',
      controlsPosition: 'right',
      class: 'w-100%!',
    },
  },
  {
    formItem: {
      label: '扫描周期范围起始(分钟)',
      prop: 'startTimeSpanStart',
    },
    component: 'el-input-number',
    attrs: {
      clearable: true,
      controlsPosition: 'right',
      class: 'w-100%!',
      disabled: true,
    },
  },
  {
    formItem: {
      label: '扫描周期范围结束(分钟)',
      prop: 'startTimeSpanEnd',
    },
    component: 'el-input-number',
    attrs: {
      clearable: true,
      controlsPosition: 'right',
      class: 'w-100%!',
      disabled: true,
    },
  },
  {
    formItem: {
      label: '非扫描时间起始(小时)',
      prop: 'noScanTimeStart',
    },
    component: 'el-input-number',
    attrs: {
      clearable: true,
      placeholder: '请输入非扫描时间起始',
      controlsPosition: 'right',
      class: 'w-100%!',
    },
  },
  {
    formItem: {
      label: '非扫描时间结束(小时)',
      prop: 'noScanTimeEnd',
    },
    component: 'el-input-number',
    attrs: {
      clearable: true,
      placeholder: '请输入非扫描时间结束',
      controlsPosition: 'right',
      class: 'w-100%!',
    },
  },
  {
    formItem: {
      label: '雷达首次运行时间',
      prop: 'radarFirstRunTime',
    },
    component: 'el-date-picker',
    attrs: {
      clearable: true,
      placeholder: '请选择雷达首次运行时间',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      type: 'datetime',
      // 禁用此刻之前的时间
      disabledDate: time => time.getTime() < Date.now(),
      style: {
        width: '100%',
      },
    },
  },
];

const syncWarehouse = async () => {
  const { company_id, company_name } = userStore.userInfo || {};
  try {
    syncLoding = true;
    await syncWarehouseApi([
      {
        company_id,
        company_name,
        kx_token: userStore.radarToken,
      },
    ]);
    proTable.value.search();
    ElMessage.success('同步成功');
  } catch (error) {
    console.error(error);
    ElMessage.error('同步失败');
  } finally {
    syncLoding = false;
  }
};

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

const deleteWarehouse = row => {
  ElMessageBox.confirm(`确定要删除仓库【${row.name}】吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteWarehouseApi(row.id);
        ElMessage.success('删除成功');
        proTable.value.search();
      } catch (error) {
        ElMessage.error('删除失败');
      }
    })
    .catch(() => {});
};

const updateScanPlan = async data => {
  const params = {
    warehouseId: data.warehouseId,
    startTimeSpan: data.startTimeSpan || null,
    noScanTimeStart: data.noScanTimeStart || null,
    noScanTimeEnd: data.noScanTimeEnd || null,
    radarFirstRunTime: data.radarFirstRunTime || null,
  };
  try {
    await updateWarehouseScanPlan(params);
    ElMessage.success('修改扫描计划成功');
    drawerRef.value.close();
    // proTable.value.search();
  } catch (error) {
    ElMessage.error('修改扫描计划失败');
    console.error(error);
  }
};

const openDrawer = async (type, row) => {
  const { cloned: record } = useCloned(row || {});
  const isAdd = type === '新增';
  const isEdit = type === '编辑';
  const isView = type === '查看';
  if (type !== '扫描') {
    drawerRef.value.acceptParams({
      isView,
      size: '500px',
      title: type + '仓库',
      data: row
        ? {
            ...record.value,
            location: record.value.location ? record.value.location.split('/') : [],
          }
        : {
            status: '302',
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
  } else {
    scanLoding[row.id] = true;
    const disabled = !BUTTONS.value.scanEdit;
    try {
      const { data } = await getWarehouseScanPlan(row.kx_warehouse_id);
      if (data?.startTimeSpanStart) {
        scanFormColumns[0].attrs.min = data.startTimeSpanStart;
      }
      if (data?.startTimeSpanEnd) {
        scanFormColumns[0].attrs.max = data.startTimeSpanEnd;
      }
      drawerRef.value.acceptParams({
        isView: disabled,
        size: '500px',
        title: row.name + '扫描计划',
        formColumns: scanFormColumns,
        formOptions: {
          labelWidth: '11rem',
          labelSuffix: ' :',
          class: 'overflow-y-auto p-r-8 h-full',
          disabled,
        },
        data,
        onSubmit: updateScanPlan,
      });
    } catch (error) {
      ElMessage.error(error?.data?.message || '查询扫描计划失败');
      console.error(error);
    } finally {
      scanLoding[row.id] = false;
    }
  }
};

const transformData = data => ({
  list: data.results,
  total: data.total,
});

const queryCompany = async () => {
  const res = await getCompany();
  companies.value = res;
};

onMounted(() => {
  queryCompany();
});
</script>

<style lang="less" scoped></style>
