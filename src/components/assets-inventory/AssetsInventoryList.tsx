import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Plus, FileSpreadsheet } from 'lucide-react';
import TableContainer from '../shared/TableContainer';
import OpenAssetsInventoryModal from './OpenAssetsInventoryModal';
import { useAssetsInventoryTable } from '../../hooks/assets-inventory/useAssetsInventoryTable';
import { getAssetsInventoryColumns } from './columns';
import { exportAssetsInventory } from '../../services/api/assetsInventoryApi';
import toast from 'react-hot-toast';

export default function AssetsInventoryList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    page,
    setPage,
    handleClose,
    totalPages,
    hasNextPage,
    hasPreviousPage
  } = useAssetsInventoryTable();

  const handleExport = async (id: number) => {
    try {
      const blob = await exportAssetsInventory(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `assets-inventory-${id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('تم تصدير الجرد بنجاح');
    } catch (error) {
      toast.error('فشل تصدير الجرد');
    }
  };

  const handleRowClick = (inventoryId: number) => {
    navigate(`/assets?inventory_id=${inventoryId}`);
  };

  const openInventory = data?.data.find(inv => inv.is_open);
  const columns = getAssetsInventoryColumns(handleClose, handleExport, handleRowClick);

  return (
    <>
      <TableContainer
        title="جرد الأصول"
        icon={ClipboardList}
        totalCount={data?.count}
        totalLabel="إجمالي عمليات الجرد"
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        searchValue=""
        onSearchChange={() => {}}
        searchPlaceholder="البحث في عمليات الجرد..."
        primaryAction={!openInventory ? {
          label: 'فتح جرد جديد',
          icon: Plus,
          onClick: () => setIsModalOpen(true)
        } : undefined}
      />

      {isModalOpen && (
        <OpenAssetsInventoryModal onClose={() => setIsModalOpen(false)} />
      )}
    </>
  );
}