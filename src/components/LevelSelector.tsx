import React from 'react';
import type { CEFRLevel } from '../types';
import { CheckCircle, Settings } from 'lucide-react';

interface LevelSelectorProps {
  currentLevel: CEFRLevel;
  onLevelChange: (level: CEFRLevel) => void;
  userLevel?: CEFRLevel;
  compact?: boolean;
}

const LevelSelector: React.FC<LevelSelectorProps> = ({
  currentLevel,
  onLevelChange,
  userLevel = 'A1',
  compact = false
}) => {
  const levels: { code: CEFRLevel; name: string; description: string; color: string }[] = [
    {
      code: 'A1',
      name: 'מתחיל',
      description: 'גילוי הצרפתית',
      color: 'bg-green-100 text-green-800 border-green-200'
    },
    {
      code: 'A2',
      name: 'בסיסי',
      description: 'הישרדות',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      code: 'B1',
      name: 'בינוני',
      description: 'רמת סף',
      color: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      code: 'B2',
      name: 'מתקדם',
      description: 'עצמאות',
      color: 'bg-purple-100 text-purple-800 border-purple-200'
    }
  ];

  const getLevelIndex = (level: CEFRLevel) => {
    return levels.findIndex(l => l.code === level);
  };

  const currentIndex = getLevelIndex(userLevel);

  if (compact) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4" dir="rtl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center">
            <Settings className="w-4 h-4 ml-2" />
            בחר רמה
          </h3>
          <div className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
            נוכחי: {currentLevel}
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2">
          {levels.map((level, index) => {
            const isUnlocked = index <= currentIndex;
            const isSelected = level.code === currentLevel;
            
            return (
              <button
                key={level.code}
                onClick={() => isUnlocked && onLevelChange(level.code)}
                disabled={!isUnlocked}
                className={`
                  p-2 rounded-lg border-2 transition-all duration-200 text-center
                  ${isSelected 
                    ? level.color + ' ring-2 ring-offset-1 ring-purple-500'
                    : isUnlocked
                      ? 'bg-gray-50 border-gray-200 hover:border-gray-300'
                      : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                  }
                `}
              >
                <div className={`text-lg font-bold ${
                  isSelected ? '' : isUnlocked ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {level.code}
                </div>
                <div className={`text-xs ${
                  isSelected ? '' : isUnlocked ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {level.name}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" dir="rtl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        בחירת רמה
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {levels.map((level, index) => {
          const isUnlocked = index <= currentIndex;
          const isSelected = level.code === currentLevel;
          
          return (
            <button
              key={level.code}
              onClick={() => isUnlocked && onLevelChange(level.code)}
              disabled={!isUnlocked}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200
                ${isSelected 
                  ? level.color + ' ring-2 ring-offset-2 ring-blue-500'
                  : isUnlocked
                    ? 'bg-gray-50 border-gray-200 hover:border-gray-300 hover:shadow-md'
                    : 'bg-gray-100 border-gray-200 opacity-50 cursor-not-allowed'
                }
              `}
            >
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  {index < currentIndex && (
                    <CheckCircle className="w-4 h-4 text-green-500 ml-1" />
                  )}
                  <span className={`text-xl font-bold ${
                    isSelected ? '' : isUnlocked ? 'text-gray-900' : 'text-gray-500'
                  }`}>
                    {level.code}
                  </span>
                </div>
                <div className={`text-sm font-medium ${
                  isSelected ? '' : isUnlocked ? 'text-gray-700' : 'text-gray-500'
                }`}>
                  {level.name}
                </div>
                <div className={`text-xs ${
                  isSelected ? '' : isUnlocked ? 'text-gray-500' : 'text-gray-400'
                }`}>
                  {level.description}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="mt-4 text-sm text-gray-600 text-right">
        <p>הרמה הנוכחית שלך: <span className="font-semibold">{userLevel}</span></p>
        <p className="text-xs mt-1">
          השלם תרגילים כדי לפתוח רמות נוספות
        </p>
      </div>
    </div>
  );
};

export default LevelSelector;