import React, { useState } from 'react';
import { X } from 'lucide-react';
import type { CEFRLevel, SkillType } from '../types';

interface AdvancedExerciseOptionsProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateExercise: (options: ExerciseOptions) => void;
  currentLevel: CEFRLevel;
}

interface ExerciseOptions {
  level: CEFRLevel;
  skills: SkillType[];
  difficulty: number;
  topics: string[];
  prompt: string;
}

const skillOptions: { type: SkillType; title: string }[] = [
  { type: 'reading', title: 'קריאה' },
  { type: 'listening', title: 'האזנה' },
  { type: 'writing', title: 'כתיבה' },
  { type: 'speaking', title: 'דיבור' },
  { type: 'vocabulary', title: 'אוצר מילים' },
  { type: 'grammar', title: 'דקדוק' },
];

const levels: CEFRLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const AdvancedExerciseOptions: React.FC<AdvancedExerciseOptionsProps> = ({
  isOpen,
  onClose,
  onCreateExercise,
  currentLevel
}) => {
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(currentLevel);
  const [selectedSkills, setSelectedSkills] = useState<SkillType[]>(['reading', 'grammar']);
  const [difficulty, setDifficulty] = useState(3);
  const [topic, setTopic] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  const handleSkillToggle = (skill: SkillType) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleCreate = () => {
    onCreateExercise({
      level: selectedLevel,
      skills: selectedSkills,
      difficulty: difficulty,
      topics: topic.trim() ? [topic.trim()] : [],
      prompt: customPrompt.trim()
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" dir="rtl">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[85vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">אפשרויות מתקדמות</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Level Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              רמת קושי
            </label>
            <div className="grid grid-cols-3 gap-2">
              {levels.map(level => (
                <button
                  key={level}
                  onClick={() => setSelectedLevel(level)}
                  className={`px-3 py-2 rounded-lg border transition-colors ${
                    selectedLevel === level
                      ? 'bg-purple-600 text-white border-purple-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-purple-300'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Skills Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              מיומנויות (בחר לפחות אחת)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {skillOptions.map(skill => (
                <label
                  key={skill.type}
                  className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedSkills.includes(skill.type)
                      ? 'bg-purple-50 border-purple-300'
                      : 'bg-white border-gray-300 hover:border-purple-200'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedSkills.includes(skill.type)}
                    onChange={() => handleSkillToggle(skill.type)}
                    className="sr-only"
                  />
                  <span className="text-sm">{skill.title}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Difficulty Slider */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              דרגת קושי: {difficulty}/5
            </label>
            <input
              type="range"
              min="1"
              max="5"
              value={difficulty}
              onChange={(e) => setDifficulty(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>קל</span>
              <span>קשה</span>
            </div>
          </div>

          {/* Topic Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              נושא (אופציונלי)
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="למשל: טיולים, מזון, עבודה..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Custom Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              הוראות מיוחדות (אופציונלי)
            </label>
            <textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="הוסף הוראות מיוחדות לתרגיל..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            ביטול
          </button>
          <button
            onClick={handleCreate}
            disabled={selectedSkills.length === 0}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            צור תרגיל
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedExerciseOptions;
