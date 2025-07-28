import React from 'react';
import { Mic } from 'lucide-react';
import { useGlobalLevel } from '../hooks/useGlobalLevel';
import GlobalLevelSelector from '../components/GlobalLevelSelector';
import ExerciseGenerator from '../components/ExerciseGenerator';

const SpeakingPage: React.FC = () => {
  const { selectedLevel, isLevelChanged } = useGlobalLevel();

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Mic className="w-8 h-8 text-teal-600 ml-3" />
            <h1 className="text-3xl font-bold text-gray-900">תרגילי דיבור</h1>
          </div>
          <GlobalLevelSelector showInHeader={true} />
        </div>
        <p className="text-gray-600">תרגלו דיבור עם בינה מלאכותית</p>
        {isLevelChanged && (
          <div className="mt-2 text-sm text-amber-600 font-medium">
            ⚠️ יש שינוי רמה שלא אושר - חזור לדשבורד לאישור
          </div>
        )}
      </div>

      <div className="space-y-6">
        <ExerciseGenerator
          level={selectedLevel}
          skillType="speaking"
        />
      </div>
    </div>
  );
};

export default SpeakingPage;