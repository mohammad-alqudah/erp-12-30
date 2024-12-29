import React, { useState } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { useUserManagement } from '../../hooks/users/useUserManagement';
import TableContainer from '../shared/TableContainer';
import CreateUserFlow from './CreateUserFlow';
import UserForm from './UserForm';
import { handleApiError } from '../../utils/errorHandling';
import toast from 'react-hot-toast';
import { Edit, Trash2 } from 'lucide-react';

export default function UsersTable() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isCreateFlowOpen, setIsCreateFlowOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [formError, setFormError] = useState('');

  const {
    users,
    totalCount,
    isLoading,
    updateUser,
    deleteUser,
  } = useUserManagement(page);

  const handleUpdateUser = async (id: string, data: any) => {
    try {
      await updateUser({ id, data });
      setIsEditFormOpen(false);
      setEditingUser(null);
      setFormError('');
    } catch (error) {
      setFormError(handleApiError(error));
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      try {
        await deleteUser(id);
      } catch (error) {
        toast.error(handleApiError(error));
      }
    }
  };

  const columns = [
    { 
      header: 'اسم المستخدم', 
      accessor: 'username',
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      )
    },
    { header: 'الاسم الأول', accessor: 'first_name' },
    { header: 'الاسم الأخير', accessor: 'last_name' },
    { header: 'البريد الإلكتروني', accessor: 'email' },
    {
      header: 'الإجراءات',
      accessor: 'id',
      render: (_, user) => (
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditingUser(user);
              setIsEditFormOpen(true);
              setFormError('');
            }}
            className="text-indigo-600 hover:text-indigo-900"
            title="تعديل"
          >
            <Edit size={20} />
          </button>
          <button
            onClick={() => handleDeleteUser(user.id)}
            className="text-red-600 hover:text-red-900"
            title="حذف"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil((totalCount || 0) / 20);

  return (
    <>
      <TableContainer
        title="المستخدمين"
        icon={Users}
        totalCount={totalCount}
        totalLabel="إجمالي المستخدمين"
        columns={columns}
        data={users}
        isLoading={isLoading}
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        hasNextPage={page < totalPages}
        hasPreviousPage={page > 1}
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="البحث عن المستخدمين..."
        primaryAction={{
          label: 'إضافة مستخدم',
          icon: UserPlus,
          onClick: () => setIsCreateFlowOpen(true)
        }}
      />

      {isCreateFlowOpen && (
        <CreateUserFlow
          onClose={() => setIsCreateFlowOpen(false)}
        />
      )}

      {isEditFormOpen && (
        <UserForm
          user={editingUser}
          onSubmit={(formData) => handleUpdateUser(editingUser.id, formData)}
          onClose={() => {
            setIsEditFormOpen(false);
            setEditingUser(null);
            setFormError('');
          }}
          isLoading={false}
          error={formError}
        />
      )}
    </>
  );
}