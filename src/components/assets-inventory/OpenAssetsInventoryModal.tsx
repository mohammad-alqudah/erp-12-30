import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { openAssetsInventory } from '../../services/api/assetsInventoryApi';
import Modal from '../shared/Modal';
import FormField from '../shared/FormField';
import Button from '../shared/Button';
import toast from 'react-hot-toast';

interface OpenAssetsInventoryModalProps {
  onClose: () => void;
}

export default function OpenAssetsInventoryModal({ onClose }: OpenAssetsInventoryModalProps) {
  const [name, setName] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation(openAssetsInventory, {
    onSuccess: () => {
      queryClient.invalidateQueries('assets-inventories');
      toast.success('تم فتح الجرد بنجاح');
      onClose();
    },
    onError: () => {
      toast.error('فشل فتح الجرد');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('الرجاء إدخال اسم الجرد');
      return;
    }
    mutation.mutate(name);
  };

  return (
    <Modal title="فتح جرد جديد" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="اسم الجرد"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="أدخل اسم الجرد"
          required
        />

        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'جارٍ الفتح...' : 'فتح الجرد'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}