import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';

// Mock data
const mockInventories = [
  {
    id: 1,
    name: 'جرد الأصول الثابتة 2024',
    open_by: 'أحمد محمد',
    created_at: '2024-03-15T10:00:00',
    is_open: true
  },
  {
    id: 2,
    name: 'جرد نهاية السنة 2023',
    open_by: 'محمد علي',
    created_at: '2023-12-31T14:30:00',
    is_open: false
  }
];

export function useAssetsInventoryTable() {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery(
    ['assets-inventories', page],
    () => ({
      data: mockInventories,
      count: mockInventories.length,
      next: null,
      previous: null
    }),
    {
      keepPreviousData: true,
    }
  );

  const closeMutation = useMutation(
    (id: number) => {
      // Mock API call
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 1000);
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assets-inventories');
        toast.success('تم إغلاق الجرد بنجاح');
      },
      onError: () => {
        toast.error('فشل إغلاق الجرد');
      },
    }
  );

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
    hasPreviousPage: page > 1
  };
}