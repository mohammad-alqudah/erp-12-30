import React from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { addCategory, updateCategory } from '../../services/api/categoryApi';
import { Category } from '../../types/asset';
import Modal from '../shared/Modal';
import FormField from '../shared/FormField';
import Button from '../shared/Button';
import toast from 'react-hot-toast';

interface CategoryFormProps {
  category?: Category | null;
  isSubCategory?: boolean;
  onClose: () => void;
}

export default function CategoryForm({ 
  category, 
  isSubCategory,
  onClose 
}: CategoryFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation(
    (formData: FormData) => {
      if (category) {
        return updateCategory(category.id, formData);
      }
      return addCategory(formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories');
        toast.success(category ? 'تم تحديث التصنيف بنجاح' : 'تم إضافة التصنيف بنجاح');
        onClose();
      },
      onError: () => {
        toast.error(category ? 'فشل تحديث التصنيف' : 'فشل إضافة التصنيف');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    if (isSubCategory && category) {
      formData.append('parent_id', category.id);
    }
    mutation.mutate(formData);
  };

  return (
    <Modal 
      title={category ? 'تعديل تصنيف' : `إضافة تصنيف ${isSubCategory ? 'فرعي' : 'رئيسي'}`}
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          label="اسم التصنيف"
          name="name"
          defaultValue={category?.name}
          required
        />

        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'جارٍ الحفظ...' : category ? 'تحديث' : 'إضافة'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}