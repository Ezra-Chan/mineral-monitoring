<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="tableColumns"
      :request-api="getRoleListApi"
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
        <el-popconfirm title="确认删除吗？" v-auth="'delete'" @confirm="deleteRole(scope.row)">
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
const proTable = ref();
const drawerRef = ref();

const formColumns = markRaw([
  {
    formItem: {
      label: '角色',
      prop: 'role',
    },
    component: 'el-select',
    attrs: {
      clearable: true,
      filterable: true,
      placeholder: '请选择角色',
    },
  },
]);

const tableColumns = reactive([
  {
    prop: 'name',
    label: '角色名称',
    minWidth: 150,
  },
  {
    prop: 'company',
    label: '角色权限',
    minWidth: 500,
  },
  { prop: 'operation', label: '操作', fixed: 'right', minWidth: 220 },
]);

const rules = reactive({
  role: [{ required: true, message: '请选择角色', trigger: 'blur' }],
});

const getRoleListApi = () => {
  // TODO: 获取角色列表数据
};

const openDrawer = (type, row) => {
  const isAdd = type === '新增';
  const isEdit = type === '编辑';
  const isView = type === '查看';

  drawerRef.value.acceptParams({
    isView,
    size: '500px',
    title: type + '角色',
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
    onSubmit: isAdd ? data => createRole(data) : data => updateRole(data),
  });
};

const createRole = data => {
  // 新增角色
};

const updateRole = data => {
  // 编辑角色
};

const deleteRole = row => {
  // 删除角色
};

const transformData = data => ({
  list: data.results,
  total: data.total,
});
</script>

<style lang="less" scoped></style>
