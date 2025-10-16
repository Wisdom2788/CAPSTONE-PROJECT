import React from 'react';
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar />
      <main className="flex-grow ml-64 pl-4 pr-4 sm:pl-6 sm:pr-6 py-4 sm:py-6 md:py-8 slide-up">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;