import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export const formatDate = (date: string | Date) => {
  return format(new Date(date), 'dd MMMM yyyy', { locale: ar });
};

export const formatDateTime = (date: string | Date) => {
  return format(new Date(date), 'dd MMMM yyyy HH:mm', { locale: ar });
};

export const formatPrice = (value: string | number): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR'
  }).format(numValue);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('ar-SA').format(value);
};