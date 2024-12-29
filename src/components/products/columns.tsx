import { Product } from '../../types/product';
import { formatPrice } from '../../utils/format';
import ActionButtons from '../shared/ActionButtons';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { SortDirection } from '../../hooks/products/useProductsTable';

interface GetProductColumnsProps {
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onSort: (column: string) => void;
  orderBy: string;
  orderDirection: SortDirection;
}

export const getProductColumns = ({ 
  onEdit, 
  onDelete,
  onSort,
  orderBy,
  orderDirection
}: GetProductColumnsProps) => {
  const renderSortHeader = (label: string, column: string) => {
    const isActive = orderBy === column;
    let Icon = ArrowUpDown;
    if (isActive) {
      Icon = orderDirection === 'asc' ? ArrowUp : ArrowDown;
    }

    return (
      <button
        onClick={() => onSort(column)}
        className="flex items-center gap-1 hover:text-gray-900 group"
      >
        <span>{label}</span>
        <Icon 
          size={16} 
          className={`transition-colors ${
            isActive 
              ? 'text-indigo-600' 
              : 'text-gray-400 group-hover:text-gray-600'
          }`}
        />
      </button>
    );
  };

  return [
    { 
      header: () => renderSortHeader('الباركود', 'barcode'),
      accessor: 'barcode',
      render: (value: string) => (
        <span className="font-medium text-gray-600">{value}</span>
      )
    },
    { 
      header: () => renderSortHeader('الاسم', 'name'),
      accessor: 'name',
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    { 
      header: () => renderSortHeader('السعر', 'price'),
      accessor: 'price',
      render: (value: string) => formatPrice(value)
    },
    { 
      header: () => renderSortHeader('الكمية', 'total_quantity'),
      accessor: 'total_quantity',
      render: (value: number) => (
        <span className="font-medium text-gray-600">{value}</span>
      )
    },
    { 
      header: () => renderSortHeader('كمية المخزون', 'total_inventory_quantity'),
      accessor: 'total_inventory_quantity',
      render: (value: number) => (
        <span className={`font-medium ${
          value === 0 ? 'text-red-600' : 
          value < 10 ? 'text-yellow-600' : 
          'text-green-600'
        }`}>
          {value}
        </span>
      )
    },
    {
      header: 'الإجراءات',
      accessor: 'id',
      render: (_, product: Product) => (
        <ActionButtons
          onEdit={() => onEdit(product)}
          onDelete={() => onDelete(product.id)}
        />
      ),
    }
  ];
};