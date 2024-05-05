import { getUserListApi } from '@/api/platform';
import { useUserStore } from '@/store/user';
import { isAdmin } from './account';

export const getUsers = async (params, data) => {
  if (isAdmin()) {
    // 管理员获取所有用户
    return await getUserListApi(params, data);
  } else {
    const userStore = useUserStore();
    const { userInfo = {} } = userStore;
    return await getUserListApi(params, {
      ...data,
      company_id: userInfo.company_id,
    });
  }
};
