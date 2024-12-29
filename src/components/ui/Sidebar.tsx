import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Package, UserCog, Settings, ClipboardList, Building, Database, Archive } from 'lucide-react';
import Logo from './Logo';
import { useBranchInfo } from '../../hooks/auth/useBranchInfo';

export default function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const { currentBranch } = useBranchInfo();
  const permissions = user.branches?.[0]?.permissions || {};

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('apiDomain');
    window.location.href = '/login';
  };

  const menuItems = [
    { icon: Settings, label: 'الإعدادات', path: '/settings', permission: true },
    { icon: Package, label: 'المنتجات', path: '/products', permission: '100_product' },
    { icon: ClipboardList, label: 'جرد المنتجات', path: '/inventory', permission: '400_inventory' },
    { icon: Database, label: 'الأصول الثابتة', path: '/assets', permission: '400_inventory' },
    { icon: Archive, label: 'جرد الأصول', path: '/assets-inventory', permission: '400_inventory' },
    { icon: UserCog, label: 'المستخدمين', path: '/users', permission: 'G1_manual_scan' },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.permission === true || permissions[item.permission as string]
  );

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-200" dir="rtl">
      <div className="p-6">
        <Logo />
      </div>
      
      <div className="flex-1 px-4 space-y-2">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-indigo-600 font-semibold">
              {user.first_name?.[0]}
              {user.last_name?.[0]}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {user.first_name} {user.last_name}
            </p>
            {currentBranch && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Building size={12} />
                <span>{currentBranch.name}</span>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 w-full px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
        >
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}