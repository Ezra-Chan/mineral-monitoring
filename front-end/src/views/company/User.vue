<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getUserListApi"
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
        <el-button
          v-auth="'delete'"
          type="primary"
          link
          :icon="Delete"
          @click="deleteUser(scope.row)"
        >
          删除
        </el-button>
      </template>
    </ProTable>
    <ProDrawer ref="drawerRef" />
  </div>
</template>

<script setup>
import { Plus, View, EditPen, Delete } from '@element-plus/icons-vue';
import { getUserListApi, createUserApi, updateUserApi, deleteUserApi } from '@/api/platform';
import { objOmit, querySearch } from '@/utils';
import { Gender } from '@/utils/constant';

const router = useRouter();
const proTable = ref();
const drawerRef = ref();
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
    enum: Gender,
    search: { el: 'select', props: { placeholder: '请选择性别', filterable: true } },
  },
  {
    prop: 'id_card',
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
    prop: 'username',
    label: '登录名',
    search: { el: 'input', props: { placeholder: '请输入登录名' } },
    minWidth: 100,
  },
  { prop: 'operation', label: '操作', fixed: 'right', minWidth: 220 },
]);
const formColumns = markRaw([
  {
    formItem: {
      label: '用户名称',
      prop: 'name',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入用户名称',
    },
  },
  {
    formItem: {
      label: '性别',
      prop: 'sex',
    },
    component: 'el-select',
    attrs: {
      clearable: true,
      placeholder: '请选择性别',
      filterable: true,
    },
    children: Gender.map(item => ({
      component: 'el-option',
      attrs: item,
    })),
  },
  {
    formItem: {
      label: '身份证号',
      prop: 'id_card',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入身份证号',
    },
  },
  {
    formItem: {
      label: '电话号码',
      prop: 'phone',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入电话号码',
    },
  },
  {
    formItem: {
      label: '邮箱',
      prop: 'email',
    },
    component: 'el-autocomplete',
    attrs: {
      clearable: true,
      placeholder: '请输入邮箱',
      fetchSuggestions: querySearch,
      class: 'w-100%',
      triggerOnFocus: false,
    },
  },
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
      label: '登录名',
      prop: 'username',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入登录名',
    },
  },
  {
    formItem: {
      label: '密码',
      prop: 'password',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入密码',
      type: 'password',
      showPassword: true,
    },
  },
]);

const rules = reactive({
  name: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  username: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入电话号码', trigger: 'blur' }],
  email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
});

const createUser = async row => {
  try {
    await createUserApi(row);
    ElMessage.success('新增成功');
    drawerRef.value.close();
    proTable.value.search();
  } catch (error) {
    ElMessage.error('新增失败');
  }
};

const updateUser = async row => {
  try {
    await updateUserApi(row.id, objOmit(row, ['id']));
    ElMessage.success('编辑成功');
    drawerRef.value.close();
    proTable.value.search();
  } catch (error) {
    ElMessage.error('编辑失败');
  }
};

const deleteUser = async row => {
  try {
    await ElMessageBox.confirm(`确定要删除用户【${row.name}】吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    await deleteUserApi(row.id);
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
    title: type + '用户',
    data: row || {
      sex: 1,
      password: '123456',
    },
    formOptions: {
      labelWidth: '10rem',
      labelSuffix: ' :',
      class: 'overflow-y-auto p-r-8 h-full',
      rules,
      disabled: isView,
    },
    formColumns,
    onSubmit: isAdd ? data => createUser(data) : data => updateUser(data),
  });
};

const transformData = data => ({
  list: data.results,
  total: data.total,
});
</script>

<style lang="less" scoped></style>
