import { getCurrentUser } from '@/utils/account';
import { getWarehouseList } from '@/utils/warehouse';
import { defaultPage } from '@/utils/constant';
import { useDictStore } from '@/store/dictionary';
import { useUserStore } from '@/store/user';

export const initSystem = async () => {
  await getCurrentUser();

  const dictStore = useDictStore();
  dictStore.getDictionary();

  const userStore = useUserStore();
  const { data: { results = [] } = {} } = await getWarehouseList(defaultPage);
  userStore.setWarehouses(results);
};
