<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      :columns="columns"
      :request-api="getUsers"
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
          v-auth="'resetPwd'"
          type="primary"
          link
          :icon="Refresh"
          @click="resetPwd(scope.row)"
        >
          重置密码
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
import { Plus, View, EditPen, Delete, Refresh } from '@element-plus/icons-vue';
import {
  createUserApi,
  updateUserApi,
  deleteUserApi,
  resetPwdApi,
  getWarehouseListApi,
} from '@/api/platform';
import { objOmit, querySearch } from '@/utils';
import { Gender, defaultPwd, SYSTEM_ROLES_MAP, defaultPage } from '@/utils/constant';
import { getUsers } from '@/utils/user';
import { getCompany } from '@/utils/company';
import { getRoles } from '@/utils/role';
import { phoneValidate, passwordValidate } from '@/utils/validate';
import { encrypt } from '@/utils/rsa';

const proTable = ref();
const drawerRef = ref();
const companies = ref([]);
const warehouses = ref([]);
const roles = ref([]);
const columns = computed(() => [
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
    prop: 'role_name',
    label: '角色',
    search: { el: 'select', props: { placeholder: '请选择角色', filterable: true } },
    minWidth: 100,
    enum: queryRoles,
  },
  {
    prop: 'company_name',
    label: '所属公司',
    minWidth: 200,
  },
  {
    prop: 'username',
    label: '登录名',
    search: { el: 'input', props: { placeholder: '请输入登录名' } },
    minWidth: 100,
  },
  { prop: 'operation', label: '操作', fixed: 'right', minWidth: 310 },
]);

const rules = reactive({
  name: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
  username: [{ required: true, message: '请输入登录名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    {
      validator: passwordValidate,
      trigger: ['blur', 'change'],
    },
  ],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    {
      validator: phoneValidate,
      trigger: ['blur', 'change'],
    },
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change'],
    },
  ],
  company_id: [{ required: true, message: '请选择所属公司', trigger: 'blur' }],
  role_id: [{ required: true, message: '请选择角色', trigger: 'blur' }],
});

const createUser = async row => {
  try {
    await createUserApi({
      ...row,
      password: encrypt(row.password),
      warehouse_ids: row.warehouse_ids?.length ? row.warehouse_ids.join(',') : undefined,
    });
    ElMessage.success('新增成功');
    drawerRef.value.close();
    proTable.value.search();
  } catch (error) {
    ElMessage.error('新增失败');
  }
};

const updateUser = async row => {
  try {
    await updateUserApi(
      row.id,
      objOmit(
        {
          ...row,
          warehouse_ids: row.warehouse_ids?.length ? row.warehouse_ids.join(',') : undefined,
        },
        ['id'],
      ),
    );
    ElMessage.success('编辑成功');
    drawerRef.value.close();
    proTable.value.search();
  } catch (error) {
    ElMessage.error('编辑失败');
  }
};

const deleteUser = row => {
  ElMessageBox.confirm(`确定要删除用户【${row.name}】吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteUserApi(row.id);
        ElMessage.success('删除成功');
        proTable.value.search();
      } catch (error) {
        ElMessage.error('删除失败');
      }
    })
    .catch(() => {});
};

const resetPwd = row => {
  ElMessageBox.confirm(`确定要重置用户【${row.name}】的密码吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await resetPwdApi(row.id);
        ElMessage.success('重置成功');
        proTable.value.search();
      } catch (error) {
        ElMessage.error('重置失败');
      }
    })
    .catch(() => {});
};

const openDrawer = (type, row) => {
  const { cloned: record } = useCloned(
    row
      ? { ...row, warehouse_ids: row.warehouse_ids ? row.warehouse_ids.split(',') : undefined }
      : {
          sex: 1,
          password: defaultPwd,
        },
  );
  const isAdd = type === '新增';
  const isEdit = type === '编辑';
  const isView = type === '查看';
  const formColumns = computed(() => [
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
        prop: 'role_id',
      },
      component: 'el-select',
      attrs: {
        clearable: true,
        filterable: true,
        placeholder: '请选择角色',
      },
      children: roles.value?.map(item => ({
        component: 'el-option',
        attrs: {
          label: item.name,
          value: item.id,
        },
      })),
      listeners: {
        change: async val => {
          drawerRef.value.modifyFormData({
            role_name: val ? roles.value?.find(item => item.id === val)?.name : '',
            warehouse_ids: [],
          });
          warehouses.value = [];
          if (
            !(
              !record.value.role_id ||
              [SYSTEM_ROLES_MAP.COMPANY_ADMIN, SYSTEM_ROLES_MAP.COMPANY_USER].includes(
                record.value.role_id,
              ) ||
              !record.value.company_id
            )
          ) {
            await getWarehouses(record.value.company_id);
          }
        },
      },
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
      listeners: {
        change: async val => {
          drawerRef.value.modifyFormData({
            company_name: val ? companies.value?.find(item => item.id === val)?.name : '',
            warehouse_ids: [],
          });
          warehouses.value = [];
          if (
            !(
              !record.value.role_id ||
              [SYSTEM_ROLES_MAP.COMPANY_ADMIN, SYSTEM_ROLES_MAP.COMPANY_USER].includes(
                record.value.role_id,
              ) ||
              !record.value.company_id
            )
          ) {
            await getWarehouses(val);
          }
        },
      },
    },
    {
      formItem: {
        label: '所属仓库',
        prop: 'warehouse_ids',
        rules: [{ required: true, message: '请选择所属仓库', trigger: 'blur' }],
      },
      component: 'el-select',
      attrs: {
        clearable: true,
        filterable: true,
        multiple: true,
        placeholder: '请选择所属仓库',
      },
      children: warehouses.value?.map(item => ({
        component: 'el-option',
        attrs: {
          label: item.name,
          value: item.id,
        },
      })),
      hide:
        !record.value.role_id ||
        [SYSTEM_ROLES_MAP.COMPANY_ADMIN, SYSTEM_ROLES_MAP.COMPANY_USER].includes(
          record.value.role_id,
        ) ||
        !record.value.company_id,
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
      hide: isEdit || isView,
    },
  ]);

  drawerRef.value.acceptParams({
    isView,
    size: '500px',
    title: type + '用户',
    data: record,
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

const queryCompany = async () => {
  const res = await getCompany();
  companies.value = res;
};

const queryRoles = async () => {
  const res = await getRoles();
  roles.value = res;
  return {
    data: res.map(item => ({
      label: item.name,
      value: item.name,
    })),
  };
};

const getWarehouses = async id => {
  const { data = {} } = await getWarehouseListApi(defaultPage, { company_id: id });
  warehouses.value = data.results;
};

onMounted(() => {
  queryCompany();
  queryRoles();
});
</script>

<style lang="less" scoped></style>
