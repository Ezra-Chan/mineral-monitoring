<template>
  <div class="table-box">
    <ProTable
      ref="proTable"
      stripe
      :columns="columns"
      :request-api="queryCompany"
      :data-callback="transformData"
      :showSearch="showSearch"
      :toolButton="toolButton"
    >
      <template #tableHeader>
        <el-button v-auth="'add'" type="primary" :icon="Plus" @click="openDrawer('新增')">
          新增
        </el-button>
      </template>
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
          @click="deleteAccount(scope.row)"
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
import { Plus, View, EditPen, Delete, Monitor } from '@element-plus/icons-vue';
import {
  getCompanyListApi,
  createCompanyApi,
  updateCompanyApi,
  deleteCompanyApi,
  getCompanyApi,
} from '@/api/platform';
import { objOmit, querySearch } from '@/utils';
import { isAdmin } from '@/utils/account';
import { CompanyStatus } from '@/utils/constant';
import { useUserStore } from '@/store/user';

const router = useRouter();
const userStore = useUserStore();
const { userInfo } = $(userStore);
const proTable = ref();
const drawerRef = ref();
const showSearch = isAdmin();
const toolButton = showSearch ? ['refresh', 'setting', 'search'] : ['refresh', 'setting'];
const columns = reactive([
  {
    prop: 'name',
    label: '公司名称',
    search: { el: 'input', props: { placeholder: '请输入公司名称' } },
    minWidth: 250,
  },
  {
    prop: 'abbreviation',
    label: '公司简称',
    search: { el: 'input', props: { placeholder: '请输入公司简称' } },
    minWidth: 100,
  },
  {
    prop: 'address',
    label: '公司地址',
    search: { el: 'input', props: { placeholder: '请输入公司地址' } },
    minWidth: 250,
  },
  {
    prop: 'credit_code',
    label: '统一社会信用代码',
    search: { el: 'input', props: { placeholder: '请输入统一社会信用代码' } },
    minWidth: 200,
  },
  {
    prop: 'establishment_time',
    label: '成立日期',
    minWidth: 150,
    render: ({ row }) =>
      row.establishment_time ? dayjs(row.establishment_time).format('YYYY-MM-DD') : null,
  },
  {
    prop: 'status',
    label: '公司状态',
    tag: true,
    enum: CompanyStatus,
    search: { el: 'select', props: { placeholder: '请选择公司状态', filterable: true } },
    minWidth: 100,
  },
  { prop: 'operation', label: '操作', fixed: 'right', minWidth: 320 },
]);
const formColumns = markRaw([
  {
    formItem: {
      label: '公司名称',
      prop: 'name',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入公司名称',
    },
  },
  {
    formItem: {
      label: '公司简称',
      prop: 'abbreviation',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入公司简称',
    },
  },
  {
    formItem: {
      label: '公司地址',
      prop: 'address',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入公司地址',
    },
  },
  {
    formItem: {
      label: '统一社会信用代码',
      prop: 'credit_code',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入统一社会信用代码',
    },
  },
  {
    formItem: {
      label: '成立日期',
      prop: 'establishment_time',
    },
    component: 'el-date-picker',
    attrs: {
      clearable: true,
      placeholder: '请选择成立日期',
      valueFormat: 'YYYY-MM-DD HH:mm:ss',
      style: {
        width: '100%',
      },
    },
  },
  {
    formItem: {
      label: '公司状态',
      prop: 'status',
    },
    component: 'el-select',
    attrs: {
      clearable: true,
      placeholder: '请选择公司状态',
      filterable: true,
    },
    children: CompanyStatus.map(item => ({
      component: 'el-option',
      attrs: item,
    })),
  },
  {
    formItem: {
      label: '可信仓URL',
      prop: 'kexin_ip',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入可信仓URL',
    },
  },
  {
    formItem: {
      label: '可信仓账号',
      prop: 'kexin_user',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入可信仓账号',
    },
  },
  {
    formItem: {
      label: '可信仓密码',
      prop: 'kexin_pwd',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入可信仓密码',
      showPassword: true,
      type: 'password',
    },
  },
  {
    formItem: {
      label: '监控平台URL',
      prop: 'monitor_ip',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入监控平台URL',
    },
  },
  {
    formItem: {
      label: '监控平台账号',
      prop: 'monitor_user',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入监控平台账号',
    },
  },
  {
    formItem: {
      label: '监控平台密码',
      prop: 'monitor_pwd',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入监控平台密码',
      showPassword: true,
      type: 'password',
    },
  },
  {
    formItem: {
      label: '邮箱账号',
      prop: 'email_account',
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
      label: '邮箱密码',
      prop: 'email_password',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入邮箱密码',
      showPassword: true,
      type: 'password',
    },
  },
  {
    formItem: {
      label: '邮箱服务器地址',
      prop: 'email_service',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入邮箱服务器地址',
    },
  },
  {
    formItem: {
      label: '邮箱服务器端口',
      prop: 'email_port',
    },
    component: 'el-input-number',
    attrs: {
      clearable: true,
      placeholder: '请输入邮箱服务器端口',
      controlsPosition: 'right',
      class: 'w-100%!',
    },
  },
]);
const rules = reactive({
  name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
  kexin_user: [{ required: true, message: '请输入可信仓账号', trigger: 'blur' }],
  kexin_pwd: [{ required: true, message: '请输入可信仓密码', trigger: 'blur' }],
  kexin_ip: [{ required: true, message: '请输入可信仓URL', trigger: 'blur' }],
  monitor_user: [{ required: true, message: '请输入监控平台账号', trigger: 'blur' }],
  monitor_pwd: [{ required: true, message: '请输入监控平台密码', trigger: 'blur' }],
  monitor_ip: [{ required: true, message: '请输入监控平台URL', trigger: 'blur' }],
  email_account: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    {
      type: 'email',
      message: '请输入正确的邮箱地址',
      trigger: ['blur', 'change'],
    },
  ],
  email_password: [{ required: true, message: '请输入邮箱密码', trigger: 'blur' }],
  email_service: [{ required: true, message: '请输入邮箱服务器地址', trigger: 'blur' }],
  email_port: [{ required: true, message: '请输入邮箱服务器端口', trigger: 'blur' }],
});

const queryCompany = async (params, data) => {
  if (showSearch) {
    return await getCompanyListApi(params, data);
  } else {
    const { data = {} } = await getCompanyApi(userInfo.company_id);
    return {
      data: {
        results: [data.company],
        total: 1,
      },
    };
  }
};

const createCompany = async row => {
  try {
    await createCompanyApi(row);
    ElMessage.success('新增成功');
    drawerRef.value.close();
    proTable.value.search();
  } catch (error) {
    ElMessage.error('新增失败');
  }
};

const updateCompany = async row => {
  try {
    await updateCompanyApi(row.id, objOmit(row, ['id']));
    ElMessage.success('编辑成功');
    drawerRef.value.close();
    proTable.value.search();
  } catch (error) {
    ElMessage.error('编辑失败');
  }
};

const deleteAccount = row => {
  ElMessageBox.confirm(`确定要删除公司【${row.name}】吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      try {
        await deleteCompanyApi(row.id);
        ElMessage.success('删除成功');
        proTable.value.search();
      } catch (error) {
        ElMessage.error('删除失败');
      }
    })
    .catch(() => {});
};

const openDrawer = (type, row) => {
  const { cloned: record } = useCloned(row || {});
  const isAdd = type === '新增';
  const isEdit = type === '编辑';
  const isView = type === '查看';
  drawerRef.value.acceptParams({
    isView,
    size: '500px',
    title: type + '公司',
    data: row
      ? record
      : {
          status: 1,
          email_service: 'smtp.exmail.qq.com',
          email_port: 465,
        },
    formOptions: {
      labelWidth: '10rem',
      labelSuffix: ' :',
      class: 'overflow-y-auto p-r-8 h-full',
      rules,
      disabled: isView,
    },
    formColumns,
    onSubmit: isAdd ? data => createCompany(data) : data => updateCompany(data),
  });
};

const transformData = data => ({
  list: data.results,
  total: data.total,
});
</script>

<style lang="less" scoped></style>
