import { getRoleListApi } from '@/api/platform';
import { SYSTEM_ROLES_MAP } from '@/utils/constant';

export const getRoles = async () => {
  const { data = {} } = await getRoleListApi();
  const roles = data.results?.filter(res => res.id !== SYSTEM_ROLES_MAP.ADMIN) || [];
  return roles;
};
