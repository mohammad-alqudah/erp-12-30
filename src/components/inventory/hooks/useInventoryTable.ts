import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getInventories, closeInventory } from '../../../services/api/inventoryApi';
import toast from 'react-hot-toast';

export function useInventoryTable() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['inventories', page],
    () => getInventories(page),
    {
      keepPreviousData: true,
    }
  );

  const closeMutation = useMutation(closeInventory, {
    onSuccess: () => {
      queryClient.invalidateQueries('inventories');
      toast.success('Inventory closed successfully');
    },
    onError: () => {
      toast.error('Failed to close inventory');
    },
  });

  const handleClose = (id: number) => {
    if (window.confirm('Are you sure you want to close this inventory?')) {
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
    hasPreviousPage: page > 1
  };
}