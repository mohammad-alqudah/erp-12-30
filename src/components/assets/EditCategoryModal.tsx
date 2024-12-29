import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { updateCategory } from '../../services/api/categoryApi';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import toast from 'react-hot-toast';

interface EditCategoryModalProps {
  category: {
    id: number;
    name: string;
  };
  onClose: () => void;
}

export default function EditCategoryModal({ category, onClose }: EditCategoryModalProps) {
  const [name, setName] = useState(category.name);
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (formData: FormData) => updateCategory(category.id, formData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories');
        toast.success('تم تحديث التصنيف بنجاح');
        onClose();
      },
      onError: () => {
        toast.error('فشل تحديث التصنيف');
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const formData = new FormData();
      formData.append('name', name);
      mutation.mutate(formData);
    }
  };

  return (
    <Modal title="تعديل التصنيف" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            اسم التصنيف
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'جاري الحفظ...' : 'حفظ'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}