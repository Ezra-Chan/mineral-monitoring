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
        <el-button
          v-auth="'view'"
          type="primary"
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
          :disabled="+scope.row.id <= SYSTEM_ROLES.length && isProd"
          @click="openDrawer('编辑', scope.row)"
        >
          编辑
        </el-button>
        <el-button
          v-auth="'delete'"
          type="danger"
          link
          :icon="Delete"
          :disabled="+scope.row.id <= SYSTEM_ROLES.length"
          @click="deleteRole(scope.row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <ProDrawer ref="drawerRef">
      <el-form
        ref="formRef"
        labelWidth="10rem"
        labelSuffix=" :"
        class="overflow-y-auto p-r-8 h-full"
        :model="formData"
        :rules="rules"
        :disabled="formStatus === '查看'"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色权限">
          <el-tree
            ref="treeRef"
            v-model="formData.permissions"
            :data="ROLE_PERMISSIONS"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            highlight-current
            default-expand-all
          />
        </el-form-item>
      </el-form>
    </ProDrawer>
  </div>
</template>

<script setup>
import { Plus, View, EditPen, Delete } from '@element-plus/icons-vue';
import { getRoleListApi, createRoleApi, updateRoleApi, deleteRoleApi } from '@/api/platform';
import { ROLE_PERMISSIONS, SYSTEM_ROLES } from '@/utils/constant';
import { getCheckedNodes, setCheckedNodes, objOmit } from '@/utils';

const proTable = ref();
const drawerRef = ref();
const formRef = ref();
const treeRef = ref();
let formStatus = $ref('查看');
let formData = $ref({
  name: '',
});
const defaultProps = {
  children: 'buttons',
  label: 'title',
};
const isProd = import.meta.env.PROD;

const tableColumns = reactive([
  {
    prop: 'name',
    label: '角色名称',
    minWidth: 150,
  },
  {
    prop: 'permissions',
    label: '角色权限',
    minWidth: 500,
    render: ({ row }) =>
      JSON.parse(row.permissions || '[]')
        .map(item => item.title)
        .join(','),
  },
  { prop: 'operation', label: '操作', fixed: 'right', minWidth: 220 },
]);

const rules = reactive({
  name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
});

const openDrawer = (type, row) => {
  const isAdd = type === '新增';
  const isView = type === '查看';
  formData = isAdd ? { name: '' } : JSON.parse(JSON.stringify(row));
  formStatus = type;

  drawerRef.value.acceptParams({
    isView,
    size: '500px',
    title: type + '角色',
    custom: true,
    onSubmit: isAdd ? createRole : updateRole,
    onShow: () =>
      treeRef.value.setCheckedKeys(setCheckedNodes(JSON.parse(formData.permissions || '[]'))),
  });
};

const validateAndFormat = async () => {
  if (!formRef.value) return;
  const valid = await formRef.value.validate();
  if (!valid) return;
  return {
    ...formData,
    permissions: JSON.stringify(getCheckedNodes(treeRef.value.getCheckedNodes(false, true))),
  };
};

const createRole = async () => {
  const data = await validateAndFormat();
  if (data) {
    try {
      await createRoleApi(data);
      ElMessage.success('新增成功');
      proTable.value.search();
      drawerRef.value.close();
    } catch (error) {
      console.log('error', error);
      ElMessage.error('新增失败');
    }
  }
};

const updateRole = async () => {
  const data = await validateAndFormat();
  if (data) {
    try {
      await updateRoleApi(data.id, objOmit(data, ['id']));
      ElMessage.success('编辑成功');
      proTable.value.search();
      drawerRef.value.close();
    } catch (error) {
      console.log('error', error);
      ElMessage.error('编辑失败');
    }
  }
};

const deleteRole = row => {
  ElMessageBox.confirm(`确定要删除角色【${row.name}】吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteRoleApi(row.id);
        ElMessage.success('删除成功');
        proTable.value.search();
      } catch (error) {
        ElMessage.error('删除失败');
      }
    })
    .catch(() => {});
};

const transformData = data => ({
  list: data.results,
  total: data.total,
});
</script>
