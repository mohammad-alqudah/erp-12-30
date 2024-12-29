import { useState } from 'react';
import { mockCategories } from '../../utils/mockData';
import toast from 'react-hot-toast';

export function useCategories() {
  const [categories, setCategories] = useState(mockCategories);

  const addMainCategory = (name: string) => {
    const newCategory = {
      id: `${Date.now()}`,
      name,
      sub_categories: []
    };
    setCategories([...categories, newCategory]);
    toast.success('تم إضافة التصنيف الرئيسي بنجاح');
  };

  const addSubCategory = (mainCategoryId: string, name: string) => {
    const updatedCategories = categories.map(category => {
      if (category.id === mainCategoryId) {
        return {
          ...category,
          sub_categories: [
            ...category.sub_categories,
            { id: `${Date.now()}`, name }
          ]
        };
      }
      return category;
    });
    setCategories(updatedCategories);
    toast.success('تم إضافة التصنيف الفرعي بنجاح');
  };

  return {
    categories,
    addMainCategory,
    addSubCategory
  };
}