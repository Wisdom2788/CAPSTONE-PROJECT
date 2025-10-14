
import React from 'react';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  caption: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, caption }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0 h-12 w-12 rounded-lg flex items-center justify-center bg-blue-100 text-primary">
          {icon}
        </div>
        <div>
          <p className="text-sm text-text-secondary font-medium">{title}</p>
          <p className="text-2xl font-bold font-heading text-text-primary">{value}</p>
          <p className="text-xs text-text-secondary">{caption}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
