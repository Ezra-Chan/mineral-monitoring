<template>
  <div class="table-box">
    <ProTable ref="proTable" :columns="columns" :request-api="getTableList">
      <template #tableHeader>
        <el-button v-auth="'add'" type="primary" :icon="Plus" @click="openDrawer('新增')">
          新增
        </el-button>
      </template>
    </ProTable>
  </div>
</template>

<script setup>
import { Plus } from '@element-plus/icons-vue';

const router = useRouter();
const proTable = ref();
const columns = reactive([
  {
    prop: 'name',
    label: '用户名称',
    search: { el: 'input', props: { placeholder: '请输入用户名称' } },
    minWidth: 150,
  },
  {
    prop: 'sex',
    label: '性别',
    minWidth: 80,
  },
  {
    prop: 'idCard',
    label: '身份证号',
    search: { el: 'input', props: { placeholder: '请输入身份证号' } },
    minWidth: 150,
  },
  {
    prop: 'phone',
    label: '电话号码',
    search: { el: 'input', props: { placeholder: '请输入电话号码' } },
    minWidth: 150,
  },
  {
    prop: 'role',
    label: '角色',
    search: { el: 'input', props: { placeholder: '请选择角色' } },
    minWidth: 100,
  },
  {
    prop: 'company',
    label: '所属公司',
    minWidth: 150,
  },
  {
    prop: 'loginName',
    label: '登录名',
    search: { el: 'input', props: { placeholder: '请输入登录名' } },
    minWidth: 100,
  },
  { prop: 'operation', label: '操作', fixed: 'right', minWidth: 200 },
]);

const getTableList = async params => {
  return [];
};
</script>

<style lang="less" scoped></style>
