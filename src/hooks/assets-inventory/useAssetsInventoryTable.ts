import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getAssetsInventories, closeAssetsInventory } from '../../services/api/assetsInventoryApi';
import toast from 'react-hot-toast';

export function useAssetsInventoryTable() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['assets-inventories', page],
    () => getAssetsInventories(page),
    {
      keepPreviousData: true,
    }
  );

  const closeMutation = useMutation(closeAssetsInventory, {
    onSuccess: () => {
      queryClient.invalidateQueries('assets-inventories');
      toast.success('تم إغلاق الجرد بنجاح');
    },
    onError: () => {
      toast.error('فشل إغلاق الجرد');
    },
  });

  const handleClose = (id: number) => {
    if (window.confirm('هل أنت متأكد من إغلاق هذا الجرد؟')) {
      closeMutation.mutate(id);
    }
  };

  return {
    data,
    isLoading,
    page,
    setPage,
    handleClose,
    totalPages: Math.ceil((data?.count || 0) / 20),
    hasNextPage: !!data?.next,
    hasPreviousPage: !!data?.previous
  };
}