import React from 'react';
import { PenTool } from 'lucide-react';
import { useGlobalLevel } from '../hooks/useGlobalLevel';
import GlobalLevelSelector from '../components/GlobalLevelSelector';
import ExerciseGenerator from '../components/ExerciseGenerator';

const WritingPage: React.FC = () => {
  const { selectedLevel, isLevelChanged } = useGlobalLevel();

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <PenTool className="w-8 h-8 text-pink-600 ml-3" />
            <h1 className="text-3xl font-bold text-gray-900">תרגילי כתיבה</h1>
          </div>
          <GlobalLevelSelector showInHeader={true} />
        </div>
        <p className="text-gray-600">פתחו את כישורי הכתיבה בצרפתית</p>
        {isLevelChanged && (
          <div className="mt-2 text-sm text-amber-600 font-medium">
            ⚠️ יש שינוי רמה שלא אושר - חזור לדשבורד לאישור
          </div>
        )}
      </div>

      <div className="space-y-6">
        <ExerciseGenerator
          level={selectedLevel}
          skillType="writing"
        />
      </div>
    </div>
  );
};

export default WritingPage;