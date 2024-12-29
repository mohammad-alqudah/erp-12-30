import React, { useState, useEffect } from 'react';
import { ChevronDown, FolderTree } from 'lucide-react';

interface CategorySelectProps {
  categories: Array<{
    id: number;
    name: string;
    sub_categories: Array<{
      id: number;
      name: string;
    }>;
  }>;
  value: string | number;
  initialMainCategory?: number;
  onChange: (value: string) => void;
}

export default function CategorySelect({ 
  categories, 
  value, 
  initialMainCategory,
  onChange 
}: CategorySelectProps) {
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');

  // Set initial main category when editing
  useEffect(() => {
    if (initialMainCategory) {
      setSelectedMainCategory(initialMainCategory.toString());
    }
  }, [initialMainCategory]);

  const handleMainCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMainCategory(e.target.value);
    onChange(''); // Reset sub-category when main category changes
  };

  const selectedCategory = categories.find(c => c.id.toString() === selectedMainCategory);

  return (
    <div className="space-y-4">
      {/* Main Category Select */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          التصنيف الرئيسي
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FolderTree className="h-5 w-5 text-gray-400" />
          </div>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={selectedMainCategory}
            onChange={handleMainCategoryChange}
            className="block w-full pr-10 pl-10 py-2 text-right bg-white border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none"
            required
          >
            <option value="">اختر التصنيف الرئيسي</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Sub Category Select */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          التصنيف الفرعي
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FolderTree className="h-5 w-5 text-gray-400" />
          </div>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ChevronDown className="h-5 w-5 text-gray-400" />
          </div>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="block w-full pr-10 pl-10 py-2 text-right bg-white border border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none"
            required
            disabled={!selectedMainCategory}
          >
            <option value="">اختر التصنيف الفرعي</option>
            {selectedCategory?.sub_categories.map((subCategory) => (
              <option key={subCategory.id} value={subCategory.id}>
                {subCategory.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}