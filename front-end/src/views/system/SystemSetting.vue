<template>
  <div class="w-full h-full flex flex-col">
    <ProForm ref="formRef" v-model="info" :form="formOptions" :columns="formColumns" />
    <div class="flex items-center justify-center">
      <el-button type="primary" @click="onSubmit" :loading="loading">提交</el-button>
    </div>
  </div>
</template>

<script setup>
import { useGlobalStore } from '@/store/global';
import { getSystemSettingApi, updateSystemSettingApi } from '@/api/platform';

const globalStore = useGlobalStore();
const { cloned: info } = useCloned({
  systemTitle: globalStore.systemTitle,
  abbreviation: globalStore.abbreviation,
});
const formRef = ref();
let loading = $ref(false);
const formColumns = computed(() => [
  {
    formItem: {
      label: '系统名称',
      prop: 'systemTitle',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入系统名称',
    },
  },
  {
    formItem: {
      label: '系统简称',
      prop: 'abbreviation',
    },
    component: 'el-input',
    attrs: {
      clearable: true,
      placeholder: '请输入系统简称',
    },
  },
]);
const rules = reactive({
  systemTitle: [{ required: true, message: '请输入系统名称', trigger: 'blur' }],
  abbreviation: [{ required: true, message: '请输入系统简称', trigger: 'blur' }],
});
const formOptions = markRaw({
  labelWidth: '10rem',
  class: 'overflow-y-auto p-r-8 w-full',
  rules,
});

const onSubmit = () => {
  if (!formRef) return;
  formRef.value.validate(async valid => {
    if (valid) {
      loading = true;
      try {
        await updateSystemSettingApi({});
        getSystemSetting();
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

const getSystemSetting = async () => {};
</script>

<style lang="less" scoped></style>
