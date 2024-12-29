import React from 'react';
import Modal from '../shared/Modal';
import FormField from '../shared/FormField';
import Button from '../shared/Button';

interface UserBasicFormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
  isLoading: boolean;
  error?: string;
}

export default function UserBasicForm({ onSubmit, onClose, isLoading, error }: UserBasicFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      username: formData.get('username'),
      password: formData.get('password'),
      first_name: formData.get('first_name'),
      last_name: formData.get('last_name'),
      email: formData.get('email'),
    };

    Object.keys(data).forEach(key => {
      if (data[key] === '' || data[key] === null) {
        delete data[key];
      }
    });

    onSubmit(data);
  };

  return (
    <Modal 
      title="إضافة مستخدم - المعلومات الأساسية" 
      onClose={onClose}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <FormField
            label="اسم المستخدم"
            name="username"
            required
          />

          <FormField
            label="كلمة المرور"
            name="password"
            type="password"
            required
          />

          <FormField
            label="الاسم الأول"
            name="first_name"
            required
          />

          <FormField
            label="الاسم الأخير"
            name="last_name"
            required
          />

          <FormField
            label="البريد الإلكتروني"
            name="email"
            type="email"
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="secondary" onClick={onClose}>
            إلغاء
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'جارٍ الإنشاء...' : 'التالي'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}