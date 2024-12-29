import { useQuery } from 'react-query';
import { getBranches } from '../../services/api/branchApi';

export function useBranchInfo() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const currentBranchId = user.branches?.[0]?.id;

  const { data: branchesResponse } = useQuery('branches', getBranches, {
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });

  const currentBranch = branchesResponse?.data.find(
    branch => branch.id === currentBranchId
  );

  return {
    currentBranch,
    currentBranchId,
    branches: branchesResponse?.data || [],
  };
}