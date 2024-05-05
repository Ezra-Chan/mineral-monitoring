import { getRoleListApi } from '@/api/platform';

export const getRoles = async () => {
  const { data = {} } = await getRoleListApi();
  const roles = data.results?.filter(res => res.id !== '1') || [];
  return roles;
};
