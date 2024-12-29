import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Edit, Trash2, Printer } from 'lucide-react';
import { Asset } from '../../types/asset';
import { formatPrice } from '../../utils/format';
import ActionButtons from '../shared/ActionButtons';

interface GetAssetColumnsProps {
  onEdit: (asset: Asset) => void;
  onDelete: (id: number) => void;
  onPrint: (asset: Asset) => void;
}

export const getAssetColumns = ({ onEdit, onDelete, onPrint }: GetAssetColumnsProps) => [
  { 
    header: 'الباركود',
    accessor: 'barcode',
    render: (value: string) => (
      <span className="font-medium text-gray-600">{value}</span>
    )
  },
  { 
    header: 'الاسم',
    accessor: 'name',
    render: (value: string) => (
      <span className="font-medium text-gray-900">{value}</span>
    )
  },
  {
    header: 'تاريخ الشراء',
    accessor: 'purchase_date',
    render: (value: string) => format(new Date(value), 'dd MMMM yyyy', { locale: ar })
  },
  {
    header: 'نسبة الإهلاك',
    accessor: 'depreciation_rate',
    render: (value: string) => `${Number(value).toFixed(2)}%`
  },
  { 
    header: 'الكمية',
    accessor: 'quantity'
  },
  {
    header: 'السعر',
    accessor: 'price',
    render: (value: string) => formatPrice(value)
  },
  {
    header: 'التصنيف الرئيسي',
    accessor: 'sub_category',
    render: (value: Asset['sub_category']) => value?.category?.name || '-'
  },
  {
    header: 'التصنيف الفرعي',
    accessor: 'sub_category',
    render: (value: Asset['sub_category']) => value?.name || '-'
  },
  {
    header: 'الإجراءات',
    accessor: 'id',
    render: (_, asset: Asset) => (
      <ActionButtons
        onEdit={() => onEdit(asset)}
        onDelete={() => onDelete(asset.id)}
        customActions={[
          {
            icon: Printer,
            onClick: () => onPrint(asset),
            title: 'طباعة الملصق',
            variant: 'info'
          }
        ]}
      />
    ),
  }
];