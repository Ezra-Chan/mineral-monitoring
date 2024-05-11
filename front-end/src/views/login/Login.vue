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
        <el-space size="large">
          <el-button
            type="primary"
            @click="systemLogin(loginFormRef)"
            size="default"
            class="text-4.5"
            :loading="systemloading"
            :disabled="bigscreenLoading"
          >
            登录后台
          </el-button>
          <el-button
            type="primary"
            @click="bigscreenLogin(loginFormRef)"
            size="default"
            class="text-4.5"
            :loading="bigscreenLoading"
            :disabled="systemloading"
          >
            登录大屏
          </el-button>
        </el-space>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { User, Lock } from '@element-plus/icons-vue';
import { useGlobalStore } from '@/store/global';
import { useUserStore } from '@/store/user';
import { useAuthStore } from '@/store/auth';
import { Encrypt } from '@/utils/AES';
import { monitoringLogin, kexinLogin, isAdmin, getCurrentUser } from '@/utils/account';
import { getCompanyApi } from '@/api/platform';
import { initDynamicRouter } from '@/router/dynamicRouter';

const globalStore = useGlobalStore();
const userStore = useUserStore();
const authStore = useAuthStore();
const router = useRouter();

const loginFormRef = ref();
const loginForm = reactive({
  username: '',
  password: '',
});
const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'change' }],
  password: [{ required: true, message: '请输入密码', trigger: 'change' }],
});
let systemloading = $ref(false);
let bigscreenLoading = $ref(false);

const login = async formEl => {
  if (!formEl) return;
  try {
    const valid = await formEl.validate();
    if (valid) {
      try {
        await monitoringLogin({
          username: loginForm.username,
          password: Encrypt(loginForm.password),
        });
        await getCurrentUser();
        return true;
      } catch (error) {
        ElMessage({ type: 'error', message: '账号或密码有误，登录失败' });
        systemloading = false;
        bigscreenLoading = false;
        console.error('登录失败', error);
      }
    }
  } catch (error) {
    systemloading = false;
    bigscreenLoading = false;
  }
};

const getOtherPlatformInfo = async () => {
  const { company_id } = userStore.userInfo;
  const { data = {} } = await getCompanyApi(company_id);
  const { kexin_user, kexin_pwd, monitor_user, monitor_pwd } = data.company || {};
  userStore.setRadarUser({
    u: kexin_user,
    p: Encrypt(kexin_pwd),
  });
  userStore.setMonitorUser({
    u: monitor_user,
    p: Encrypt(monitor_pwd),
  });
  await kexinLogin();
  ElMessage({ type: 'success', message: '登录成功' });
};

const systemLogin = async formEl => {
  systemloading = true;
  const flag = await login(formEl, true);
  if (!flag) return;
  try {
    await initDynamicRouter();
    if (isAdmin()) {
      ElMessage({ type: 'success', message: '登录成功' });
      setTimeout(() => {
        router.push('/');
      }, 1000);
    } else {
      try {
        if (authStore.hasPermission('system')) {
          await getOtherPlatformInfo();
          setTimeout(() => {
            const menu = authStore.authMenuList[0];
            router.push(menu.path);
          }, 1000);
        } else {
          ElMessage({ type: 'warning', message: '您没有访问后台的权限，请联系管理员' });
          userStore.setToken('');
        }
      } catch (error) {
        ElMessage({ type: 'error', message: '获取权限失败' });
        console.error('获取权限失败', error);
        userStore.setToken('');
      }
    }
  } catch (error) {
    console.error('登录失败', error);
  } finally {
    systemloading = false;
  }
};

const bigscreenLogin = async formEl => {
  bigscreenLoading = true;
  const flag = await login(formEl);
  if (!flag) return;
  if (isAdmin()) {
    ElMessage({ type: 'warning', message: '请从后台访问大屏' });
    userStore.setToken('');
  } else {
    try {
      await initDynamicRouter();
      if (authStore.hasPermission('bigscreen')) {
        await getOtherPlatformInfo();
        setTimeout(() => {
          router.push('/bigscreen');
        }, 1000);
      } else {
        ElMessage({ type: 'warning', message: '您没有访问大屏的权限，请联系管理员' });
        userStore.setToken('');
      }
    } catch (error) {
      ElMessage({ type: 'error', message: '获取权限失败' });
      console.error('获取权限失败', error);
      userStore.setToken('');
    }
  }
  bigscreenLoading = false;
};

onMounted(() => {
  userStore.setToken('');
});
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
          letter-spacing: 0.2em;
          padding-left: 1.2em;
        }
      }
    }
  }
}
</style>
