import React from 'react';
import { Check, Settings } from 'lucide-react';
import { useGlobalLevel } from '../hooks/useGlobalLevel';
import type { CEFRLevel } from '../types';

interface GlobalLevelSelectorProps {
  showInHeader?: boolean;
}

const GlobalLevelSelector: React.FC<GlobalLevelSelectorProps> = ({ showInHeader = false }) => {
  const { selectedLevel, tempLevel, setTempLevel, confirmLevel, isLevelChanged } = useGlobalLevel();

  const levels: { code: CEFRLevel; name: string; color: string; bgColor: string }[] = [
    { code: 'A1', name: 'מתחיל', color: 'text-green-700', bgColor: 'bg-green-100 border-green-300' },
    { code: 'A2', name: 'בסיסי', color: 'text-blue-700', bgColor: 'bg-blue-100 border-blue-300' },
    { code: 'B1', name: 'בינוני', color: 'text-amber-700', bgColor: 'bg-amber-100 border-amber-300' },
    { code: 'B2', name: 'מתקדם', color: 'text-purple-700', bgColor: 'bg-purple-100 border-purple-300' }
  ];

  if (showInHeader) {
    return (
      <div className="flex items-center space-x-3">
        <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          רמה: {selectedLevel}
        </div>
        {isLevelChanged && (
          <button
            onClick={confirmLevel}
            className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-1"
          >
            <Check className="w-3 h-3" />
            <span>אשר</span>
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center">
          <Settings className="w-7 h-7 ml-3 text-purple-600" />
          בחר את רמת הלימוד שלך
        </h3>
        <div className="flex items-center space-x-3">
          <span className="text-base text-gray-600">רמה נוכחית:</span>
          <div className="px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-base font-bold">
            {selectedLevel}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-6 mb-8">
        {levels.map((level) => {
          const isSelected = tempLevel === level.code;
          const isCurrent = selectedLevel === level.code;
          
          return (
            <button
              key={level.code}
              onClick={() => setTempLevel(level.code)}
              className={`p-8 rounded-2xl border-2 transition-all duration-200 hover:scale-105 relative shadow-sm ${
                isSelected
                  ? `${level.bgColor} ${level.color} ring-2 ring-purple-300`
                  : 'border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-25'
              }`}
            >
              {isCurrent && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className="text-4xl font-bold mb-3">{level.code}</div>
              <div className="text-base text-gray-600">{level.name}</div>
              
              {isSelected && tempLevel !== selectedLevel && (
                <div className="mt-3">
                  <span className="inline-block w-3 h-3 bg-purple-500 rounded-full animate-pulse"></span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {isLevelChanged && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-900 text-lg">שינוי רמה</h4>
              <p className="text-base text-blue-700">
                רמה נבחרת: {tempLevel} (רמה נוכחית: {selectedLevel})
              </p>
            </div>
            <button
              onClick={confirmLevel}
              className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold transition-all hover:scale-105 flex items-center space-x-3 shadow-sm"
            >
              <Check className="w-5 h-5" />
              <span>אשר שינוי רמה</span>
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-base text-gray-600">
          {isLevelChanged ? (
            <span className="text-blue-600 font-medium">לחץ "אשר שינוי רמה" כדי לשמור</span>
          ) : (
            <span>רמה נבחרת: <span className="font-bold text-purple-600">{selectedLevel}</span></span>
          )}
        </p>
      </div>
    </div>
  );
};

export default GlobalLevelSelector;