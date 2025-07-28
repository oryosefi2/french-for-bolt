import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProgress } from '../hooks/useProgress';
import LevelSelector from '../components/LevelSelector';
import SkillCard from '../components/SkillCard';
import ProgressChart from '../components/ProgressChart';
import { Calendar, Target, Clock, Award } from 'lucide-react';
import type { CEFRLevel, SkillType } from '../types';

const Dashboard: React.FC = () => {
  const { user, updateUserLevel } = useAuth();
  const { progress, getAverageScore, getTotalTimeSpent, getStreakDays } = useProgress(user?.id);
  const [selectedLevel, setSelectedLevel] = useState<CEFRLevel>(user?.current_level || 'A1');

  const skills: { type: SkillType; title: string; description: string }[] = [
    { type: 'reading', title: 'קריאה', description: 'הבנת הנקרא' },
    { type: 'listening', title: 'האזנה', description: 'הבנת הנשמע' },
    { type: 'writing', title: 'כתיבה', description: 'ביטוי בכתב' },
    { type: 'speaking', title: 'דיבור', description: 'ביטוי בעל פה' },
    { type: 'vocabulary', title: 'אוצר מילים', description: 'מילים וביטויים' },
    { type: 'grammar', title: 'דקדוק', description: 'כללים ומבנים' },
  ];

  const handleSkillClick = (skillType: SkillType) => {
    // Navigate to exercise page
    window.location.hash = `#/exercise/${selectedLevel}/${skillType}`;
  };

  const getSkillProgress = (skillType: SkillType) => {
    const skillProgress = progress.filter(p => p.skill_type === skillType && p.level === selectedLevel);
    return skillProgress.length > 0 ? getAverageScore(skillType) : 0;
  };

  const stats = [
    {
      icon: Target,
      label: 'ציון ממוצע',
      value: `${Math.round(getAverageScore())}%`,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: Clock,
      label: 'זמן כולל',
      value: `${Math.round(getTotalTimeSpent() / 3600)}ש`,
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: Calendar,
      label: 'רצף',
      value: `${getStreakDays()}י`,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      icon: Award,
      label: 'תרגילים',
      value: progress.length.toString(),
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          שלום, {user.name || 'לומד'}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          המשיכו ללמוד צרפתית עם תרגילים מותאמים אישית
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-full ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Level Selector */}
          <LevelSelector
            currentLevel={selectedLevel}
            userLevel={user.current_level}
            onLevelChange={setSelectedLevel}
          />

          {/* Skills Grid */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              כישורי לימוד - רמה {selectedLevel}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {skills.map((skill) => (
                <SkillCard
                  key={skill.type}
                  skillType={skill.type}
                  title={skill.title}
                  description={skill.description}
                  progress={getSkillProgress(skill.type)}
                  onClick={() => handleSkillClick(skill.type)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              פעולות מהירות
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => window.location.hash = '#/daily-challenge'}
                className="w-full px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 font-medium transition-all"
              >
                🎯 אתגר יומי
              </button>
              <button
                onClick={() => window.location.hash = '#/conversation'}
                className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 font-medium transition-all"
              >
                💬 שיחה חופשית
              </button>
              <button
                onClick={() => window.location.hash = '#/flashcards'}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg hover:from-purple-600 hover:to-indigo-600 font-medium transition-all"
              >
                🃏 כרטיסי זיכרון
              </button>
            </div>
          </div>

          {/* Progress Chart */}
          <ProgressChart progress={progress} />

          {/* Level Management */}
          {selectedLevel !== user.current_level && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">שינוי רמה</h4>
              <p className="text-sm text-blue-700 mb-3">
                אתה צופה ברמה {selectedLevel}, אבל הרמה הנוכחית שלך היא {user.current_level}.
              </p>
              <button
                onClick={() => updateUserLevel(selectedLevel)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                הגדר {selectedLevel} כרמה ראשית
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;