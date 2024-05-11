import { getCompanyListApi } from '@/api/platform';
import { useUserStore } from '@/store/user';
import { defaultPage } from '@/utils/constant';
import { isAdmin } from './account';

export const getCompany = async () => {
  if (isAdmin()) {
    const { data = {} } = await getCompanyListApi(defaultPage);
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
