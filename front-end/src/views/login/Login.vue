<template>
  <div
    class="login-wrapper w-full h-full flex justify-center items-center select-none overflow-hidden"
  >
    <el-form
      ref="loginFormRef"
      label-position="right"
      class="w-sm p10 b-rd-2 b b-style-solid b-cyan"
      hide-required-asterisk
      status-icon
      size="large"
      :model="loginForm"
      :rules="rules"
      @keyup.enter.native="login(loginFormRef)"
    >
      <el-text type="primary" tag="div" class="font-size-7! text-center m-b-8!">
        {{ globalStore.systemTitle }}
      </el-text>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" :prefix-icon="User" placeholder="请输入账号" />
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          type="password"
          v-model="loginForm.password"
          show-password
          placeholder="请输入密码"
          :prefix-icon="Lock"
        />
      </el-form-item>
      <el-form-item class="submit-button">
        <el-button
          type="primary"
          @click="login(loginFormRef)"
          size="default"
          class="text-4.5"
          :loading="loading"
        >
          登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { User, Lock } from '@element-plus/icons-vue';
import { getToken } from '@/utils/account';
import { useGlobalStore } from '@/store/global';

defineProps({
  msg: String,
});

const router = useRouter();
const globalStore = useGlobalStore();
const loginFormRef = ref();
const loginForm = reactive({
  username: '',
  password: '',
});
const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'change' }],
  password: [{ required: true, message: '请输入密码', trigger: 'change' }],
});
let loading = $ref(false);

const login = async formEl => {
  if (!formEl) return;
  await formEl.validate(async valid => {
    if (valid) {
      try {
        loading = true;
        await getToken(loginForm);
        ElMessage({ type: 'success', message: '登录成功' });
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } catch (error) {
        ElMessage({ type: 'error', message: '登录失败' });
        console.error('登录失败', error);
      } finally {
        loading = false;
      }
    }
  });
};
</script>

<style scoped lang="less">
.login-wrapper {
  background: url('../../assets/images/login-bg.png') no-repeat;
  background-size: 100% 100%;
  .el-form {
    background-color: #fffffff5;
    box-shadow: 0 0 3rem #595a61;

    :deep(.submit-button) {
      .el-form-item__content {
        display: flex;
        justify-content: center;
        .el-button {
          letter-spacing: 1em;
          padding-left: 2em;
        }
      }
    }
  }
}
</style>
