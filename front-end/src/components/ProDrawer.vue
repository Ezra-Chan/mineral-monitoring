<template>
  <el-drawer v-bind="drawerProps" v-model="drawerVisible" destroy-on-close>
    <ProForm
      ref="formRef"
      v-model="drawerProps.data"
      :form="drawerProps.formOptions"
      :columns="drawerProps.formColumns"
    />
    <template #footer>
      <el-button @click="drawerVisible = false">取消</el-button>
      <el-button v-show="!drawerProps.isView" type="primary" @click="handleSubmit(formRef)">
        确定
      </el-button>
    </template>
  </el-drawer>
</template>

<script setup>
let drawerVisible = $ref(false);
let drawerProps = $ref({});
const formRef = ref();

const acceptParams = params => {
  drawerProps = params;
  drawerVisible = true;
};

const close = () => (drawerVisible = false);

const handleSubmit = async formEl => {
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    drawerProps.onSubmit?.(drawerProps.data);
  });
};

defineExpose({
  acceptParams,
  close,
});
</script>

<style lang="less" scoped></style>
