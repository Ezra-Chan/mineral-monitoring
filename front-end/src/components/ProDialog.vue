<template>
  <el-dialog v-bind="dialogProps" v-model="dialogVisible" destroy-on-close>
    <ProForm
      ref="formRef"
      v-if="!dialogProps.custom"
      v-model="dialogProps.data"
      :form="dialogProps.formOptions"
      :columns="dialogProps.formColumns"
    />
    <template v-else>
      <slot name="default"></slot>
    </template>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button v-show="!dialogProps.isView" type="primary" @click="handleSubmit(formRef)">
        确定
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup>
let dialogVisible = $ref(false);
let dialogProps = $ref({});
let formRef = $ref(null);

const acceptParams = params => {
  if (dialogVisible) {
    dialogProps = { ...dialogProps, ...params };
    return;
  }
  dialogProps = params;
  dialogVisible = true;
  nextTick(() => {
    dialogProps?.onShow?.();
  });
};

const close = () => (dialogVisible = false);

const handleSubmit = async formEl => {
  if (dialogProps.custom) {
    dialogProps.onSubmit?.();
    return;
  }
  if (!formEl) return;
  formEl.validate(async valid => {
    if (!valid) return;
    dialogProps.onSubmit?.(dialogProps.data);
  });
};

const modifyFormData = data => {
  if (!dialogProps.custom) {
    dialogProps.data = Object.assign(dialogProps.data, data);
  }
};

const updateFormColumns = columns => {
  dialogProps.formColumns = columns;
};

const getFormData = () => {
  return dialogProps.data;
};

defineExpose({
  acceptParams,
  close,
  modifyFormData,
  updateFormColumns,
});
</script>

<style lang="less" scoped></style>
