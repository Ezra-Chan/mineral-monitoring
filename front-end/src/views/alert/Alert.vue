<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      stripe
      :columns="columns"
      :request-api="queryAlert"
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
          v-auth="'read'"
          v-if="!scope.row.active"
          type="primary"
          link
          :icon="Check"
          @click="readAlert(scope.row)"
        >
          已读
        </el-button>
      </template>
    </ProTable>
    <ProDrawer ref="drawerRef" />
  </div>
</template>

<script setup>
import { Check, View } from '@element-plus/icons-vue';
import { readAlertApi, getAlertListApi } from '@/api/platform';
import { ALERT_STATUS } from '@/utils/constant';
import { useUserStore } from '@/store/user';
import { useDictStore } from '@/store/dictionary';

const bus = useEventBus('station-message');
const userStore = useUserStore();
const dictStore = useDictStore();
const { userInfo, warehouses } = $(userStore);
const { dict } = $(dictStore);
const proTable = ref();
const drawerRef = ref();
const columns = computed(() => [
  {
    prop: 'warehouse_id',
    label: '仓库',
    search: { el: 'select', props: { placeholder: '请选择仓库', filterable: true } },
    minWidth: 150,
    enum: warehouses.map(w => ({
      label: w.name,
      value: w.id,
    })),
  },
  {
    prop: 'goods_id',
    label: '货物',
    search: { el: 'select', props: { placeholder: '请选择货物', filterable: true } },
    minWidth: 150,
    enum: dict.GOODS_TYPE.ORIGIN_ENUM,
  },
  {
    prop: 'content',
    label: '内容',
    minWidth: 300,
  },
  {
    prop: 'active',
    label: '状态',
    search: { el: 'select', props: { placeholder: '请选择状态' } },
    minWidth: 150,
    enum: ALERT_STATUS,
  },
  { prop: 'operation', label: '操作', fixed: 'right', minWidth: 150 },
]);
const formColumns = markRaw([
  {
    formItem: {
      label: '仓库',
      prop: 'warehouse_name',
    },
    component: 'el-input',
  },
  {
    formItem: {
      label: '货物',
      prop: 'goods_name',
    },
    component: 'el-input',
  },
  {
    formItem: {
      label: '内容',
      prop: 'content',
    },
    component: 'el-input',
    attrs: {
      type: 'textarea',
      rows: 3,
    },
  },
  {
    formItem: {
      label: '状态',
      prop: 'active',
    },
    component: 'el-select',
    children: ALERT_STATUS.map(item => ({
      component: 'el-option',
      attrs: item,
    })),
  },
  {
    formItem: {
      label: '操作人',
      prop: 'operator_name',
    },
    component: 'el-input',
  },
  {
    formItem: {
      label: '操作时间',
      prop: 'operator_time',
    },
    component: 'el-date-picker',
    attrs: {
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      style: {
        width: '100%',
      },
    },
  },
]);

const readAlert = row => {
  ElMessageBox.confirm(`确定该事件已处理吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await readAlertApi(row.id);
        ElMessage.success('操作成功');
        proTable.value.search();
        bus.emit();
      } catch (error) {
        ElMessage.error('操作失败');
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
    title: type + '字典',
    data: record,
    formOptions: {
      labelWidth: '10rem',
      labelSuffix: ' :',
      class: 'overflow-y-auto p-r-8 h-full',
      disabled: isView,
    },
    formColumns,
  });
};

const queryAlert = async (params, data) => {
  return await getAlertListApi(params, { ...data, source: userInfo.company_id });
};

const transformData = data => ({
  list: data.results,
  total: data.total,
});
</script>

<style lang="less" scoped></style>
