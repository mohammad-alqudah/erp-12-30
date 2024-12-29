import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import PageHeader from '../shared/PageHeader';
import BranchSettings from './BranchSettings';

export default function SettingsPage() {
  return (
    <div className="p-8">
      <PageHeader 
        title="الإعدادات" 
        icon={SettingsIcon}
        description="إدارة إعدادات وتفضيلات التطبيق"
      />

      <div className="mt-8 max-w-4xl space-y-8">
        <BranchSettings />
      </div>
    </div>
  );
}