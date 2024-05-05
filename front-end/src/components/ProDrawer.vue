<template>
  <el-drawer v-bind="drawerProps" v-model="drawerVisible" destroy-on-close>
    <ProForm
      ref="formRef"
      v-if="!drawerProps.custom"
      v-model="drawerProps.data"
      :form="drawerProps.formOptions"
      :columns="drawerProps.formColumns"
    />
    <template v-else>
      <slot name="default"></slot>
    </template>
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
  nextTick(() => {
    drawerProps?.onShow?.();
  });
};

const close = () => (drawerVisible = false);

const handleSubmit = async formEl => {
  if (drawerProps.custom) {
    drawerProps.onSubmit?.();
    return;
  }
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    drawerProps.onSubmit?.(drawerProps.data);
  });
};

const modifyFormData = data => {
  if (!drawerProps.custom) {
    drawerProps.data = Object.assign(drawerProps.data, data);
  }
};

defineExpose({
  acceptParams,
  close,
  modifyFormData,
});
</script>

<style lang="less" scoped></style>
