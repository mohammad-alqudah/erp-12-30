import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getCategories, addCategory, addSubCategory } from '../../services/api/categoryApi';
import Modal from '../shared/Modal';
import Button from '../shared/Button';
import EditCategoryModal from './EditCategoryModal';
import EditSubCategoryModal from './EditSubCategoryModal';
import toast from 'react-hot-toast';
import { FolderPlus, Edit, ChevronDown, FolderTree } from 'lucide-react';

export default function CategoryManagement({ onClose }: { onClose: () => void }) {
  const [newMainCategory, setNewMainCategory] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingSubCategory, setEditingSubCategory] = useState<any>(null);
  
  const queryClient = useQueryClient();

  // Fetch categories
  const { data: categories } = useQuery('categories', getCategories);

  // Add main category mutation
  const addMainCategoryMutation = useMutation(
    (name: string) => {
      const formData = new FormData();
      formData.append('name', name);
      return addCategory(formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories');
        setNewMainCategory('');
        toast.success('تم إضافة التصنيف بنجاح');
      },
      onError: () => {
        toast.error('فشل إضافة التصنيف');
      }
    }
  );

  // Add sub category mutation
  const addSubCategoryMutation = useMutation(
    ({ name, categoryId }: { name: string; categoryId: string }) => {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('category', categoryId);
      return addSubCategory(formData);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('categories');
        setNewSubCategory('');
        setSelectedMainCategory('');
        toast.success('تم إضافة التصنيف الفرعي بنجاح');
      },
      onError: () => {
        toast.error('فشل إضافة التصنيف الفرعي');
      }
    }
  );

  const handleAddMainCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMainCategory.trim()) {
      addMainCategoryMutation.mutate(newMainCategory);
    }
  };

  const handleAddSubCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubCategory.trim() && selectedMainCategory) {
      addSubCategoryMutation.mutate({
        name: newSubCategory,
        categoryId: selectedMainCategory
      });
    }
  };

  return (
    <Modal title="إدارة التصنيفات" onClose={onClose} maxWidth="lg">
      <div className="space-y-6" dir="rtl">
        {/* Add Main Category Form */}
        <form onSubmit={handleAddMainCategory} className="space-y-4">
          <h3 className="font-medium text-gray-900">إضافة تصنيف رئيسي</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMainCategory}
              onChange={(e) => setNewMainCategory(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="اسم التصنيف الرئيسي"
            />
            <Button type="submit" disabled={addMainCategoryMutation.isLoading}>
              إضافة
            </Button>
          </div>
        </form>

        {/* Add Sub Category Form */}
        <form onSubmit={handleAddSubCategory} className="space-y-4">
          <h3 className="font-medium text-gray-900">إضافة تصنيف فرعي</h3>
          <div className="space-y-2">
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <FolderTree className="h-5 w-5 text-gray-400" />
              </div>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={selectedMainCategory}
                onChange={(e) => setSelectedMainCategory(e.target.value)}
                className="block w-full pr-10 pl-10 py-2 text-right bg-white border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none"
              >
                <option value="">اختر التصنيف الرئيسي</option>
                {categories?.data.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newSubCategory}
                onChange={(e) => setNewSubCategory(e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="اسم التصنيف الفرعي"
              />
              <Button 
                type="submit" 
                disabled={addSubCategoryMutation.isLoading || !selectedMainCategory}
              >
                إضافة
              </Button>
            </div>
          </div>
        </form>

        {/* Categories List */}
        <div className="mt-6">
          <h3 className="font-medium text-gray-900 mb-4">التصنيفات الحالية</h3>
          <div className="space-y-4">
            {categories?.data.map((category) => (
              <div key={category.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingCategory(category)}
                    icon={Edit}
                  >
                    تعديل
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {category.sub_categories?.map((subCategory) => (
                    <div
                      key={subCategory.id}
                      className="flex justify-between items-center bg-gray-50 p-2 rounded"
                    >
                      <span className="text-sm">{subCategory.name}</span>
                      <button
                        onClick={() => setEditingSubCategory(subCategory)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Modals */}
        {editingCategory && (
          <EditCategoryModal
            category={editingCategory}
            onClose={() => setEditingCategory(null)}
          />
        )}
        {editingSubCategory && (
          <EditSubCategoryModal
            subCategory={editingSubCategory}
            categories={categories?.data || []}
            onClose={() => setEditingSubCategory(null)}
          />
        )}
      </div>
    </Modal>
  );
}