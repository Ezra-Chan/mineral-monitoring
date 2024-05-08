import { getWarehouseListApi } from '@/api/platform';
import { useUserStore } from '@/store/user';
import { SYSTEM_ROLES_MAP } from '@/utils/constant';

export const getWarehouseList = async (params, data) => {
  const userStore = useUserStore();
  const { role_id, company_id, warehouse_ids } = userStore.userInfo || {};
  // 如果是公司层级，则返回所有仓库
  if ([SYSTEM_ROLES_MAP.COMPANY_ADMIN, SYSTEM_ROLES_MAP.COMPANY_USER].includes(role_id)) {
    return await getWarehouseListApi(params, { ...data, company_id });
  }
  // 如果是普通用户，则返回有权限的仓库
  const { page, per_page } = params;
  const res = await getWarehouseListApi({ page: 1, per_page: 9999999 }, { ...data, company_id });
  const warehouses = warehouse_ids ? warehouse_ids.split(',') : [];
  const filters = res.results.filter(item => warehouses.includes(item.id));
  res.total = filters.length;
  res.results = filters.slice((page - 1) * per_page, page * per_page);
  return res;
};
