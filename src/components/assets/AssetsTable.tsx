import React, { useState } from 'react';
import { Database, Plus } from 'lucide-react';
import { useAssetsTable } from '../../hooks/assets/useAssetsTable';
import TableContainer from '../shared/TableContainer';
import { getAssetColumns } from './columns';
import AssetForm from './AssetForm';
import CategoryManagement from './CategoryManagement';
import PrintAssetModal from './PrintAssetModal';
import { Asset } from '../../types/asset';

export default function AssetsTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCategoryManagementOpen, setIsCategoryManagementOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [printingAsset, setPrintingAsset] = useState<Asset | null>(null);
  
  const {
    data,
    isLoading,
    handleDelete
  } = useAssetsTable(page, search);

  const columns = getAssetColumns({
    onEdit: (asset) => {
      setEditingAsset(asset);
      setIsFormOpen(true);
    },
    onDelete: handleDelete,
    onPrint: (asset) => setPrintingAsset(asset)
  });

  return (
    <>
      <TableContainer
        title="الأصول الثابتة"
        icon={Database}
        totalCount={data?.count}
        totalLabel="إجمالي الأصول"
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        page={page}
        totalPages={Math.ceil((data?.count || 0) / 20)}
        onPageChange={setPage}
        hasNextPage={!!data?.next}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="البحث في الأصول..."
        primaryAction={{
          label: 'إضافة أصل',
          icon: Plus,
          onClick: () => {
            setEditingAsset(null);
            setIsFormOpen(true);
          }
        }}
        secondaryAction={{
          label: 'إدارة التصنيفات',
          icon: Database,
          onClick: () => setIsCategoryManagementOpen(true)
        }}
      />

      {isFormOpen && (
        <AssetForm
          asset={editingAsset}
          onClose={() => {
            setIsFormOpen(false);
            setEditingAsset(null);
          }}
        />
      )}

      {isCategoryManagementOpen && (
        <CategoryManagement
          onClose={() => setIsCategoryManagementOpen(false)}
        />
      )}

      {printingAsset && (
        <PrintAssetModal
          asset={printingAsset}
          onClose={() => setPrintingAsset(null)}
        />
      )}
    </>
  );
}