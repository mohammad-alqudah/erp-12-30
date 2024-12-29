import React, { useState } from 'react';
import { Package, Upload } from 'lucide-react';
import { useProductsTable } from '../../hooks/products/useProductsTable';
import ProductForm from './ProductForm';
import ImportProductsModal from '../ImportProductsModal';
import TableContainer from '../shared/TableContainer';
import { getProductColumns } from './columns';

export default function ProductsTable() {
  const [editingProduct, setEditingProduct] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const {
    data,
    isLoading,
    page,
    setPage,
    search,
    setSearch,
    handleDelete,
    orderBy,
    orderDirection,
    handleSort,
    isInventoryView,
    notInventoryItems,
    setNotInventoryItems
  } = useProductsTable();

  const columns = getProductColumns({
    onEdit: (product) => {
      setEditingProduct(product);
      setIsFormOpen(true);
    },
    onDelete: handleDelete,
    onSort: handleSort,
    orderBy,
    orderDirection
  });

  return (
    <>
      <TableContainer
        title="المنتجات"
        icon={Package}
        totalCount={data?.count}
        totalLabel="إجمالي المنتجات"
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        page={page}
        totalPages={Math.ceil((data?.count || 0) / 20)}
        onPageChange={setPage}
        hasNextPage={!!data?.next}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="البحث في المنتجات..."
        primaryAction={{
          label: 'إضافة منتج',
          icon: Package,
          onClick: () => {
            setEditingProduct(null);
            setIsFormOpen(true);
          }
        }}
        secondaryAction={{
          label: 'استيراد المنتجات',
          icon: Upload,
          onClick: () => setIsImportModalOpen(true)
        }}
        additionalFilters={isInventoryView && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={notInventoryItems}
              onChange={(e) => setNotInventoryItems(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-700">العناصر الغير مجرودة</span>
          </label>
        )}
      />

      {isFormOpen && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setIsFormOpen(false);
            setEditingProduct(null);
          }}
        />
      )}

      {isImportModalOpen && (
        <ImportProductsModal
          onClose={() => setIsImportModalOpen(false)}
        />
      )}
    </>
  );
}