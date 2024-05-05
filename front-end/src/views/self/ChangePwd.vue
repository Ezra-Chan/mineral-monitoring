<template>
  <el-form
    ref="formRef"
    label-width="10rem"
    :model="pwdForm"
    :rules="rules"
    class="w-140 p-r-8 p-t-8"
  >
    <el-form-item label="原密码" prop="oldPwd">
      <el-input v-model="pwdForm.oldPwd" type="password" show-password />
    </el-form-item>
    <el-form-item label="新密码" prop="newPwd">
      <el-input v-model="pwdForm.newPwd" type="password" show-password />
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPwd">
      <el-input v-model="pwdForm.confirmPwd" type="password" show-password />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="confirm" :loading="loading"> 确认修改 </el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { updatePasswordApi } from '@/api/platform';
import { passwordValidate } from '@/utils/validate';
import { encrypt } from '@/utils/rsa';

const pwdForm = $ref({
  oldPwd: '',
  newPwd: '',
  confirmPwd: '',
});
const formRef = $ref();
let loading = $ref(false);
const rules = reactive({
  oldPwd: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
  newPwd: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    {
      validator: passwordValidate,
      trigger: ['blur', 'change'],
    },
  ],
  confirmPwd: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      asyncValidator: (_, value) => {
        return new Promise((resolve, reject) => {
          if (value !== pwdForm.newPwd) {
            reject('两次输入密码不一致');
          } else {
            resolve();
          }
        });
      },
      trigger: 'blur',
    },
  ],
});

const confirm = () => {
  if (!formRef) return;
  formRef.validate(async valid => {
    if (valid) {
      loading = true;
      try {
        const { oldPwd, newPwd } = pwdForm;
        const { success, message } = await updatePasswordApi({
          old_password: encrypt(oldPwd),
          new_password: encrypt(newPwd),
        });
        if (!success) {
          ElMessage.error(message);
          return;
        }
        ElMessage.success('修改成功!');
      } catch (error) {
        console.error(error);
        ElMessage.error('修改失败');
      } finally {
        loading = false;
        formRef.resetFields();
      }
    }
  });
};
</script>
