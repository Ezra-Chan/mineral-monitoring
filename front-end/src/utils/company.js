import { getCompanyListApi } from '@/api/platform';
import { useUserStore } from '@/store/user';
import { isAdmin } from './account';

export const getCompany = async () => {
  if (isAdmin()) {
    const { data = {} } = await getCompanyListApi({
      page: 1,
      per_page: 999999,
    });
    return data.results;
  } else {
    const userStore = useUserStore();
    const { userInfo } = userStore;
    if (userInfo) {
      return [
        {
          id: userInfo.company_id,
          name: userInfo.company_name,
        },
      ];
    }
    return [];
  }
};
