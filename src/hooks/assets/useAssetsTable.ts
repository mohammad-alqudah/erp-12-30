import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAssets, deleteAsset } from '../../services/api/assetApi';
import toast from 'react-hot-toast';

export function useAssetsTable(page: number, search: string) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['assets', page, search],
    () => getAssets(page, search),
    {
      keepPreviousData: true,
    }
  );

  const deleteMutation = useMutation(deleteAsset, {
    onSuccess: () => {
      queryClient.invalidateQueries('assets');
      toast.success('تم حذف الأصل بنجاح');
    },
    onError: () => {
      toast.error('فشل حذف الأصل');
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الأصل؟')) {
      deleteMutation.mutate(id);
    }
  };

  return {
    data,
    isLoading,
    handleDelete
  };
}