import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { addProduct, updateProduct } from '../../services/api/productApi';
import Modal from '../shared/Modal';
import FormField from '../shared/FormField';
import Button from '../shared/Button';
import toast from 'react-hot-toast';
import { Product } from '../../types/product';

interface ProductFormProps {
  product?: Product | null;
  onClose: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    barcode: product?.barcode || '',
    price: product?.price || '',
  });

  const queryClient = useQueryClient();

  const mutation = useMutation(
    (data: typeof formData) => {
      if (product) {
        return updateProduct(product.id, data);
      }
      return addProduct(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success(product ? 'تم تحديث المنتج بنجاح' : 'تم إضافة المنتج بنجاح');
        onClose();
      },
      onError: () => {
        toast.error(product ? 'فشل تحديث المنتج' : 'فشل إضافة المنتج');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <Modal title={product ? 'تعديل المنتج' : 'إضافة منتج'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="الاسم"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />

        <FormField
          label="الباركود"
          value={formData.barcode}
          onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
          required
        />

        <FormField
          label="السعر"
          type="number"
          step="0.001"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />

        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'جارٍ الحفظ...' : product ? 'تحديث' : 'إضافة'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}