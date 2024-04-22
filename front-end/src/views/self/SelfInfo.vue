<template>
  <ProForm ref="formRef" v-model="userInfo" :form="formOptions" :columns="formColumns" />
  <div class="flex items-center justify-center gap-8 p-t-8 p-r-8">
    <el-button type="primary" @click="onSubmit">提交</el-button>
  </div>
</template>

<script setup>
import { querySearch } from '@/utils';
import { useUserStore } from '@/store/user';
import { Gender } from '@/utils/constant';

const userStore = useUserStore();
const { userInfo } = $(userStore);
const formRef = ref();
const formOptions = markRaw({
  inline: true,
  labelWidth: '10rem',
  class: 'overflow-y-auto p-r-8',
  group: true,
  defaultExpandAll: true,
});
const formColumns = markRaw([
  {
    title: '个人信息',
    children: [
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
          placeholder: '性别',
          filterable: true,
        },
        children: Gender.map(item => ({
          component: 'el-option',
          attrs: item,
        })),
      },
    ],
  },
  {
    title: '学历信息',
    children: [
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
    ],
  },
]);

const onSubmit = () => {
  if (!formRef) return;
  formRef.value.validate(valid => {
    if (valid) {
      console.log('submit!');
    } else {
      console.log('error submit!');
      return false;
    }
  });
};
</script>

<style lang="less" scoped></style>
