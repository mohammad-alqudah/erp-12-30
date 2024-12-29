import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { updateSubCategory } from '../../services/api/categoryApi';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import toast from 'react-hot-toast';

interface EditSubCategoryModalProps {
  subCategory: {
    id: number;
    name: string;
    category: number;
  };
  categories: Array<{ id: number; name: string }>;
  onClose: () => void;
}

export default function EditSubCategoryModal({ 
  subCategory, 
  categories,
  onClose 
}: EditSubCategoryModalProps) {
  const [name, setName] = useState(subCategory.name);
  const [categoryId, setCategoryId] = useState(subCategory.category);
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (formData: FormData) => updateSubCategory(subCategory.id, formData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories');
        toast.success('تم تحديث التصنيف الفرعي بنجاح');
        onClose();
      },
      onError: () => {
        toast.error('فشل تحديث التصنيف الفرعي');
      }
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', categoryId.toString());
      mutation.mutate(formData);
    }
  };

  return (
    <Modal title="تعديل التصنيف الفرعي" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            اسم التصنيف الفرعي
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            التصنيف الرئيسي
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
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