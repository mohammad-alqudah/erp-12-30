import React, { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { extractHeaders, importProducts } from '../services/api';
import Button from './shared/Button';
import FormField from './shared/FormField';

interface ImportProductsModalProps {
  onClose: () => void;
}

export default function ImportProductsModal({ onClose }: ImportProductsModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [skippedRows, setSkippedRows] = useState<number | null>(null);
  const [mappings, setMappings] = useState({
    name: '',
    barcode: '',
    quantity: '',
    price: '',
  });
  const [isUploading, setIsUploading] = useState(false);
  const queryClient = useQueryClient();

  const extractHeadersMutation = useMutation(
    async ({ file, skippedRows }: { file: File; skippedRows: number }) => {
      return extractHeaders(file, skippedRows);
    },
    {
      onSuccess: (response) => {
        setHeaders(response.data);
        setIsUploading(false);
      },
      onError: () => {
        toast.error('فشل استخراج العناوين من الملف');
        setIsUploading(false);
      },
    }
  );

  const importMutation = useMutation(
    async () => {
      if (!file) throw new Error('لم يتم اختيار ملف');
      if (!mappings.name || !mappings.barcode) {
        throw new Error('حقول الاسم والباركود مطلوبة');
      }
      
      setIsUploading(true);
      const finalMappings = {
        name: mappings.name,
        barcode: mappings.barcode,
        ...(mappings.quantity && { quantity: mappings.quantity }),
        ...(mappings.price && { price: mappings.price }),
      };
      
      return importProducts(file, finalMappings, skippedRows || 0);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
        toast.success('تم استيراد المنتجات بنجاح');
        onClose();
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : 'فشل استيراد المنتجات');
        setIsUploading(false);
      },
    }
  );

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setIsUploading(true);
      extractHeadersMutation.mutate({ file: selectedFile, skippedRows: skippedRows || 0 });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('الرجاء اختيار ملف');
      return;
    }
    if (!mappings.name || !mappings.barcode) {
      toast.error('حقول الاسم والباركود مطلوبة');
      return;
    }
    importMutation.mutate();
  };

  const renderColumnSelect = (
    field: keyof typeof mappings,
    label: string,
    required: boolean = false
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={mappings[field]}
        onChange={(e) => setMappings({ ...mappings, [field]: e.target.value })}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        disabled={isUploading}
        required={required}
      >
        <option key={`${field}-default`} value="">اختر العمود</option>
        {headers.map((header, index) => (
          <option key={`${field}-${header}-${index}`} value={header}>
            {header}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10 rounded-lg">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                {extractHeadersMutation.isLoading ? 'جارٍ تحليل الملف...' : 'جارٍ استيراد المنتجات...'}
              </p>
              <p className="text-xs text-gray-500 mt-1">قد يستغرق هذا دقيقة</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">استيراد المنتجات</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={isUploading}
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!headers.length && (
            <>
              <div className="space-y-4">
                <FormField
                  label="تخطي الصفوف"
                  type="number"
                  min="0"
                  value={skippedRows === null ? '' : skippedRows}
                  onChange={(e) => setSkippedRows(parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block mb-2">
                  <div className="flex items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                    <div className="flex flex-col items-center space-y-2">
                      <Upload className="w-6 h-6 text-gray-600" />
                      <span className="font-medium text-gray-600">
                        {file ? file.name : 'اسحب الملفات هنا أو انقر للاختيار'}
                      </span>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".csv,.xlsx,.xls"
                      onChange={handleFileChange}
                      disabled={isUploading}
                    />
                  </div>
                </label>
              </div>
            </>
          )}

          {headers.length > 0 && (
            <div className="space-y-4">
              {renderColumnSelect('name', 'عمود اسم المنتج', true)}
              {renderColumnSelect('barcode', 'عمود الباركود', true)}
              {renderColumnSelect('quantity', 'عمود الكمية')}
              {renderColumnSelect('price', 'عمود السعر')}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <Button
              variant="secondary"
              onClick={onClose}
              disabled={isUploading}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={isUploading || !file || (!headers.length && !file)}
            >
              {importMutation.isLoading ? 'جارٍ الاستيراد...' : headers.length ? 'استيراد' : 'التالي'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}