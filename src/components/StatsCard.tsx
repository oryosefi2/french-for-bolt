import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  color: string;
  bgColor: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ icon: Icon, title, value, color, bgColor }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-7 h-7 ${color}`} />
        </div>
      </div>
      <div className="text-right">
        <p className="text-gray-600 text-sm font-medium mb-2">{title}</p>
        <p className={`text-4xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;

const StatsCard2: React.FC<StatsCardProps> = ({ icon: Icon, title, value, color, bgColor }) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );
}