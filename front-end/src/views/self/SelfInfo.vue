<template>
  <ProForm ref="formRef" v-model="info" :form="formOptions" :columns="formColumns" />
  <div class="flex items-center justify-center gap-8 p-t-8 p-r-8">
    <el-button type="primary" @click="onSubmit" :loading="loading">提交</el-button>
  </div>
</template>

<script setup>
import { querySearch, objPick } from '@/utils';
import { useUserStore } from '@/store/user';
import { Gender } from '@/utils/constant';
import { getCompany } from '@/utils/company';
import { getRoles } from '@/utils/role';
import { getCurrentUser } from '@/utils/account';
import { phoneValidate } from '@/utils/validate';
import { updateUserApi } from '@/api/platform'

const userStore = useUserStore();
const { userInfo } = $(userStore);
const { cloned: info } = useCloned(userInfo);
const formRef = ref();
const companies = ref([]);
const roles = ref([]);
let loading = $ref(false);
const formColumns = computed(() => [
  {
    formItem: {
      label: '姓名',
      prop: 'name',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入姓名',
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
      disabled: true,
    },
    children: roles.value?.map(item => ({
        component: 'el-option',
        attrs: {
          label: item.name,
          value: item.id,
        },
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
      disabled: true,
    },
    children: companies.value?.map(item => ({
        component: 'el-option',
        attrs: {
          label: item.name,
          value: item.id,
        },
      })),
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
      disabled: true,
    },
  },
]);
const rules = reactive({
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入电话号码', trigger: 'blur' },
    {
      validator: phoneValidate,
      trigger: 'blur',
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
});
const formOptions = markRaw({
  labelWidth: '10rem',
  class: 'overflow-y-auto p-r-8',
  rules,
});

const onSubmit = () => {
  if (!formRef) return;
  formRef.value.validate(async valid => {
    if (valid) {
      loading = true;
      try {
        await updateUserApi(info.value.id, objPick(info.value, ['name', 'sex', 'id_card', 'phone', 'email']));
        getCurrentUser()
        ElMessage.success('修改成功');
      } catch (error) {
        console.error(error);
        ElMessage.error('修改失败');
      } finally {
        loading = false;
      }
    } else {
      console.log('error submit!');
      return false;
    }
  });
};

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

onMounted(() => {
  queryCompany();
  queryRoles();
});
</script>

<style lang="less" scoped></style>
