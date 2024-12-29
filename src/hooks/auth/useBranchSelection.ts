import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { getBranchPermissions } from '../../services/api/branchPermissionsApi';
import toast from 'react-hot-toast';

export function useBranchSelection() {
  const navigate = useNavigate();

  const mutation = useMutation(
    async (branchId: number) => {
      const response = await getBranchPermissions(branchId);
      return { branchId, permissions: response.data };
    },
    {
      onSuccess: ({ branchId, permissions }) => {
        // Update user data with selected branch and permissions
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.branches) {
          user.branches[0] = {
            id: branchId,
            permissions
          };
          localStorage.setItem('user', JSON.stringify(user));
          navigate('/products');
        }
      },
      onError: () => {
        toast.error('Failed to get branch permissions');
      }
    }
  );

  return {
    selectBranch: mutation.mutate,
    isLoading: mutation.isLoading
  };
}