import React from 'react';
import { BranchPermission } from '../../types/user';
import { useUserPermissions } from '../../hooks/users/useUserPermissions';
import { permissionTranslations } from '../../utils/permissionTranslations';

interface BranchPermissionsFormProps {
  branchPermissions: BranchPermission[];
  onChange: (permissions: BranchPermission[]) => void;
  userId?: string;
  isEditing?: boolean;
}

export default function BranchPermissionsForm({ 
  branchPermissions, 
  onChange,
  userId,
  isEditing = false
}: BranchPermissionsFormProps) {
  const { updatePermission, isUpdating } = useUserPermissions(userId || '');

  const handlePermissionChange = async (branchId: number, permissionKey: string, value: boolean) => {
    const updatedPermissions = branchPermissions.map(branch => {
      if (branch.branch_id === branchId) {
        return {
          ...branch,
          permissions: {
            ...branch.permissions,
            [permissionKey]: value,
          },
        };
      }
      return branch;
    });
    onChange(updatedPermissions);

    if (isEditing && userId) {
      try {
        await updatePermission({
          branchId,
          permission: permissionKey,
          isPermitted: value,
        });
      } catch (error) {
        onChange(branchPermissions);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {branchPermissions.map((branch) => (
        <div 
          key={branch.branch_id} 
          className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
        >
          <h4 className="text-sm font-medium text-gray-900 mb-3 pb-2 border-b border-gray-200">
            {branch.branch_name}
          </h4>
          <div className="space-y-3">
            {Object.entries(branch.permissions).map(([key, value]) => (
              <label 
                key={key} 
                className="flex items-center space-x-3 hover:bg-gray-100 p-2 rounded-md transition-colors"
              >
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => handlePermissionChange(branch.branch_id, key, e.target.checked)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  disabled={isUpdating}
                />
                <span className="text-sm text-gray-700 mr-2">
                  {permissionTranslations[key] || key}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}