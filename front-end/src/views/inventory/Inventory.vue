<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      stripe
      :columns="columns"
      :request-api="queryInventory"
      :data-callback="transformData"
    />
  </div>
</template>

<script setup>
import dayjs from 'dayjs';
import { getInventoryListApi } from '@/api/platform';
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
const columns = reactive([
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
    prop: 'goods_remaining',
    label: '数量',
    minWidth: 150,
  },
  {
    prop: 'unit',
    label: '单位',
    minWidth: 100,
  },
  {
    prop: 'operate_time',
    label: '操作时间',
    minWidth: 200,
  },
]);

const queryInventory = async (params, data) => {
  if (!data.warehouse_name || !data.warehouse_name.length) {
    data.warehouse_name = warehouseMap.value;
  }
  return await getInventoryListApi(params, data);
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
