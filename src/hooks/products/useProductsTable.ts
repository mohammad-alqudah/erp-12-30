import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { getProducts, deleteProduct } from '../../services/api/productApi';
import { useDebounce } from '../useDebounce';
import toast from 'react-hot-toast';

export type SortDirection = 'asc' | 'desc';

export function useProductsTable() {
  const [searchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [orderBy, setOrderBy] = useState<string>('');
  const [orderDirection, setOrderDirection] = useState<SortDirection>('desc');
  const [notInventoryItems, setNotInventoryItems] = useState(false);
  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(search, 500);
  
  const inventoryId = searchParams.get('inventory_id');

  const { data, isLoading } = useQuery(
    ['products', page, debouncedSearch, inventoryId, orderBy, orderDirection, notInventoryItems],
    () => getProducts(
      page, 
      debouncedSearch, 
      inventoryId ? parseInt(inventoryId) : undefined, 
      orderBy, 
      orderDirection,
      notInventoryItems
    ),
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, inventoryId, orderBy, orderDirection, notInventoryItems]);

  const deleteMutation = useMutation(deleteProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('products');
      toast.success('Product deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete product');
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSort = (column: string) => {
    if (orderBy === column) {
      setOrderDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setOrderBy(column);
      setOrderDirection('desc');
    }
  };

  return {
    data,
    isLoading,
    page,
    setPage,
    search,
    setSearch,
    handleDelete,
    isInventoryView: !!inventoryId,
    orderBy,
    orderDirection,
    handleSort,
    notInventoryItems,
    setNotInventoryItems
  };
}