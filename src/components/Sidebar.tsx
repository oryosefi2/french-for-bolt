import React from 'react';
import { Home, BookOpen, Headphones, PenTool, Mic, Brain, FileText } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  userStats: {
    level: string;
    points: number;
    streak: number;
  };
}

const Sidebar: React.FC<SidebarProps> = ({ currentPage, onPageChange, userStats }) => {
  const menuItems = [
    { id: 'dashboard', label: 'דשבורד', icon: Home, color: 'text-purple-600' },
    { id: 'reading', label: 'קריאה', icon: BookOpen, color: 'text-green-600' },
    { id: 'listening', label: 'האזנה', icon: Headphones, color: 'text-purple-600' },
    { id: 'writing', label: 'כתיבה', icon: PenTool, color: 'text-pink-600' },
    { id: 'speaking', label: 'דיבור', icon: Mic, color: 'text-teal-600' },
    { id: 'vocabulary', label: 'אוצר מילים', icon: Brain, color: 'text-orange-600' },
    { id: 'grammar', label: 'דקדוק', icon: FileText, color: 'text-indigo-600' },
  ];

  return (
    <div className="w-64 bg-white h-screen shadow-lg border-l border-gray-200 flex flex-col" dir="rtl">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center mb-4 text-right">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center ml-3">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">FrenchAI</h1>
            <p className="text-sm text-gray-500">לימוד צרפתית חכם</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-right transition-colors ${
                  currentPage === item.id
                    ? 'bg-purple-50 text-purple-700 border-r-4 border-purple-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium flex-1">{item.label}</span>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Stats */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
          <div className="text-center mb-3">
            <div className="text-2xl font-bold text-purple-600">{userStats.level}</div>
            <div className="text-sm text-gray-600">רמה נוכחית</div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold text-blue-600">{userStats.points}</span>
              <span className="text-gray-600">נקודות</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold text-orange-600">{userStats.streak}</span>
              <span className="text-gray-600">רצף ימים</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;