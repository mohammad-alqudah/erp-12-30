import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { FileSpreadsheet } from 'lucide-react';
import Button from '../shared/Button';
import ActionButton from '../shared/ActionButton';

export const getInventoryColumns = (
  onClose: (id: number) => void, 
  onExport: (id: number) => void,
  onRowClick: (id: number) => void
) => [
  { 
    header: 'الاسم', 
    accessor: 'name',
    render: (value: string, inventory: any) => (
      <button 
        onClick={() => onRowClick(inventory.id)}
        className="font-medium text-gray-900 hover:text-indigo-600 transition-colors"
      >
        {value}
      </button>
    )
  },
  { 
    header: 'تم الفتح بواسطة', 
    accessor: 'open_by' 
  },
  {
    header: 'تاريخ الإنشاء',
    accessor: 'created_at',
    render: (value: string) => format(new Date(value), 'dd MMMM yyyy', { locale: ar })
  },
  {
    header: 'الحالة',
    accessor: 'is_open',
    render: (value: boolean) => (
      <span className={`px-2 py-1 rounded-full text-sm ${
        value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {value ? 'مفتوح' : 'مغلق'}
      </span>
    )
  },
  {
    header: 'الإجراءات',
    accessor: 'id',
    render: (_, inventory: any) => (
      <div className="flex items-center gap-2">
        {inventory.is_open && (
          <Button
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              onClose(inventory.id);
            }}
          >
            إغلاق الجرد
          </Button>
        )}
        <ActionButton
          icon={FileSpreadsheet}
          onClick={(e) => {
            e.stopPropagation();
            onExport(inventory.id);
          }}
          title="تصدير إلى Excel"
          variant="success"
        />
      </div>
    ),
  }
];