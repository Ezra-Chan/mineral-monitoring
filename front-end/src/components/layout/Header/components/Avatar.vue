<template>
  <el-dropdown trigger="click">
    <div class="w-10 h-10 border-rdp-50 overflow-hidden cursor-pointer">
      <img class="w-full h-full" src="@/assets/images/user.png" alt="avatar" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="router.push('/self')">
          <el-icon><User /></el-icon>个人中心
        </el-dropdown-item>
        <el-dropdown-item divided @click="logout">
          <el-icon><SwitchButton /></el-icon>退出登录
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup>
import { LOGIN_URL } from '@/config';
import { logoutMonitoring } from '@/utils/account';
import { useTabsStore } from '@/store/tabs';
import { useKeepAliveStore } from '@/store/keepAlive';

const router = useRouter();
const tabStore = useTabsStore();
const keepAliveStore = useKeepAliveStore();

// 退出登录
const logout = () => {
  ElMessageBox.confirm('您是否确认退出登录?', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    // 1.执行退出登录接口
    await logoutMonitoring();
    tabStore.closeMultipleTab();
    keepAliveStore.setKeepAliveName();

    // 2.重定向到登录页
    router.replace(LOGIN_URL);
    ElMessage.success('退出登录成功！');
  });
};
</script>
