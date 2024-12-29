import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { addAsset, updateAsset } from '../../services/api/assetApi';
import { getCategories } from '../../services/api/categoryApi';
import Modal from '../shared/Modal';
import FormField from '../shared/FormField';
import Button from '../shared/Button';
import toast from 'react-hot-toast';
import { Asset } from '../../types/asset';
import CategorySelect from './CategorySelect';

interface AssetFormProps {
  asset?: Asset | null;
  onClose: () => void;
}

export default function AssetForm({ asset, onClose }: AssetFormProps) {
  const [formData, setFormData] = useState({
    name: asset?.name || '',
    price: asset?.price || '',
    purchase_date: asset?.purchase_date?.split('T')[0] || '',
    depreciation_rate: asset?.depreciation_rate || '',
    quantity: asset?.quantity || '',
    sub_category: asset?.sub_category?.id || ''
  });

  const queryClient = useQueryClient();
  const { data: categories } = useQuery('categories', getCategories);

  const mutation = useMutation(
    (data: FormData) => asset ? updateAsset(asset.id, data) : addAsset(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('assets');
        toast.success(asset ? 'تم تحديث الأصل بنجاح' : 'تم إضافة الأصل بنجاح');
        onClose();
      },
      onError: () => {
        toast.error(asset ? 'فشل تحديث الأصل' : 'فشل إضافة الأصل');
      }
    }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== '') {
        form.append(key, value.toString());
      }
    });

    mutation.mutate(form);
  };

  return (
    <Modal title={asset ? 'تعديل أصل' : 'إضافة أصل'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
        <FormField
          label="الاسم"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />

        <FormField
          label="السعر"
          type="number"
          step="0.001"
          min="0"
          value={formData.price}
          onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
          required
        />

        <FormField
          label="تاريخ الشراء"
          type="date"
          value={formData.purchase_date}
          onChange={(e) => setFormData(prev => ({ ...prev, purchase_date: e.target.value }))}
          required
        />

        <FormField
          label="نسبة الإهلاك"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={formData.depreciation_rate}
          onChange={(e) => setFormData(prev => ({ ...prev, depreciation_rate: e.target.value }))}
          required
        />

        <FormField
          label="الكمية"
          type="number"
          min="0"
          placeholder="0"
          value={formData.quantity}
          onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
          required
        />

        <CategorySelect
          categories={categories?.data || []}
          value={formData.sub_category}
          initialMainCategory={asset?.sub_category?.category?.id}
          onChange={(value) => setFormData(prev => ({ ...prev, sub_category: value }))}
        />

        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit" disabled={mutation.isLoading}>
            {mutation.isLoading ? 'جارٍ الحفظ...' : asset ? 'تحديث' : 'إضافة'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}