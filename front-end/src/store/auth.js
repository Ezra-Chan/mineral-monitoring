import { defineStore } from 'pinia';
import { getRoleApi } from '@/api/platform';
import {
  getFlatMenuList,
  getShowMenuList,
  getAllBreadcrumbList,
  formatMenuAndButton,
} from '@/utils';
import { useUserStore } from '@/store/user';
import { getCurrentUser } from '@/utils/account';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 按钮权限列表
    authButtonList: {},
    // 菜单权限列表
    authMenuList: [],
    // 当前页面的 router name，用来做按钮权限筛选
    routeName: '',
  }),
  getters: {
    // 按钮权限列表
    authButtonListGet: state => state.authButtonList,
    // 菜单权限列表 ==> 这里的菜单没有经过任何处理
    authMenuListGet: state => state.authMenuList,
    // 菜单权限列表 ==> 左侧菜单栏渲染，需要剔除 isHide == true
    showMenuListGet: state => getShowMenuList(state.authMenuList),
    // 菜单权限列表 ==> 扁平化之后的一维数组菜单，主要用来添加动态路由
    flatMenuListGet: state => getFlatMenuList(state.authMenuList),
    // 递归处理后的所有面包屑导航列表
    breadcrumbListGet: state => getAllBreadcrumbList(state.authMenuList),
  },
  actions: {
    async setRouteName(name) {
      this.routeName = name;
    },
    async getAuthPermission() {
      const userStore = useUserStore();
      if (!userStore.userInfo?.role_id) {
        await getCurrentUser();
      }
      const { data } = await getRoleApi(userStore.userInfo?.role_id);
      const { menus, buttons } = formatMenuAndButton(JSON.parse(data.role?.permissions || '[]'));
      this.authButtonList = buttons;
      this.authMenuList = menus;
    },
    hasPermission(modules) {
      if (modules === 'bigscreen') {
        return this.authMenuList.find(menu => menu.name === modules);
      } else {
        return this.authMenuList.length > 1;
      }
    },
  },
});
