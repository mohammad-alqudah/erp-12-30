import { api } from './baseApi';
import { BranchPermissionsResponse } from '../../types/branch';

export const getBranchPermissions = async (branchId: number): Promise<BranchPermissionsResponse> => {
  const response = await api.get<BranchPermissionsResponse>(`/auth/branches/${branchId}/permissions`);
  return response.data;
};