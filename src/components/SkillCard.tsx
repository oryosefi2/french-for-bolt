import React from 'react';
import { BookOpen, Headphones, PenTool, Mic, Brain, FileText } from 'lucide-react';
import type { SkillType } from '../types';

interface SkillCardProps {
  skillType: SkillType;
  title: string;
  description: string;
  progress: number;
  onClick: () => void;
  disabled?: boolean;
}

const SkillCard: React.FC<SkillCardProps> = ({
  skillType,
  title,
  description,
  progress,
  onClick,
  disabled = false
}) => {
  const getIcon = () => {
    switch (skillType) {
      case 'reading':
        return <BookOpen className="w-8 h-8" />;
      case 'listening':
        return <Headphones className="w-8 h-8" />;
      case 'writing':
        return <PenTool className="w-8 h-8" />;
      case 'speaking':
        return <Mic className="w-8 h-8" />;
      case 'vocabulary':
        return <Brain className="w-8 h-8" />;
      case 'grammar':
        return <FileText className="w-8 h-8" />;
      default:
        return <BookOpen className="w-8 h-8" />;
    }
  };

  const getColor = () => {
    switch (skillType) {
      case 'reading':
        return 'text-blue-600';
      case 'listening':
        return 'text-purple-600';
      case 'writing':
        return 'text-green-600';
      case 'speaking':
        return 'text-red-600';
      case 'vocabulary':
        return 'text-amber-600';
      case 'grammar':
        return 'text-indigo-600';
      default:
        return 'text-gray-600';
    }
  };

  const getBgColor = () => {
    switch (skillType) {
      case 'reading':
        return 'bg-blue-50 border-blue-200';
      case 'listening':
        return 'bg-purple-50 border-purple-200';
      case 'writing':
        return 'bg-green-50 border-green-200';
      case 'speaking':
        return 'bg-red-50 border-red-200';
      case 'vocabulary':
        return 'bg-amber-50 border-amber-200';
      case 'grammar':
        return 'bg-indigo-50 border-indigo-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full p-6 border-2 rounded-xl transition-all duration-200 group
        ${disabled 
          ? 'opacity-50 cursor-not-allowed bg-gray-100 border-gray-200'
          : `${getBgColor()} hover:shadow-lg hover:scale-105 hover:border-opacity-60`
        }
      `}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`${getColor()} ${disabled ? 'text-gray-400' : ''}`}>
          {getIcon()}
        </div>
        
        <div>
          <h3 className={`text-lg font-semibold ${
            disabled ? 'text-gray-500' : 'text-gray-900'
          }`}>
            {title}
          </h3>
          <p className={`text-sm mt-1 ${
            disabled ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {description}
          </p>
        </div>

        <div className="w-full" dir="rtl">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>{Math.round(progress)}%</span>
            <span>התקדמות</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                disabled ? 'bg-gray-300' : getColor().replace('text-', 'bg-')
              }`}
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </button>
  );
};

export default SkillCard;