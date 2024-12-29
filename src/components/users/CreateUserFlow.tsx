import React, { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import toast from 'react-hot-toast';
import { createUser } from '../../services/api/userApi';
import { handleApiError } from '../../utils/errorHandling';
import UserBasicForm from './UserBasicForm';
import UserPermissionsForm from './UserPermissionsForm';

interface CreateUserFlowProps {
  onClose: () => void;
}

export default function CreateUserFlow({ onClose }: CreateUserFlowProps) {
  const [step, setStep] = useState(1);
  const [userId, setUserId] = useState<string | null>(null);
  const [formError, setFormError] = useState('');
  const queryClient = useQueryClient();

  const createMutation = useMutation(
    (data: any) => createUser(data),
    {
      onSuccess: (response) => {
        if (response.status) {
          setUserId(response.data.id);
          setStep(2);
          queryClient.invalidateQueries('users');
          toast.success('تم إنشاء المستخدم بنجاح. الرجاء تعيين الصلاحيات.');
        } else {
          setFormError(response.detail || 'فشل إنشاء المستخدم');
        }
      },
      onError: (error) => {
        setFormError(handleApiError(error));
      },
    }
  );

  const handleBasicInfoSubmit = (formData: any) => {
    createMutation.mutate(formData);
  };

  const handlePermissionsComplete = () => {
    queryClient.invalidateQueries('users');
    toast.success('تم تحديث صلاحيات المستخدم بنجاح');
    onClose();
  };

  if (step === 1) {
    return (
      <UserBasicForm
        onSubmit={handleBasicInfoSubmit}
        onClose={onClose}
        isLoading={createMutation.isLoading}
        error={formError}
      />
    );
  }

  return (
    <UserPermissionsForm
      userId={userId!}
      onComplete={handlePermissionsComplete}
      onClose={onClose}
    />
  );
}