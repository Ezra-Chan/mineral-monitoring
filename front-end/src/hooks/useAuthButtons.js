import { useAuthStore } from '@/store/auth';

/**
 * @description 页面按钮权限
 * */
export const useAuthButtons = () => {
  const authStore = useAuthStore();
  const authButtons = authStore.authButtonListGet[authStore.routeName] ?? [];

  const BUTTONS = computed(() => {
    const currentPageAuthButton = {};
    authButtons.forEach(item => (currentPageAuthButton[item] = true));
    return currentPageAuthButton;
  });

  return {
    BUTTONS,
  };
};
