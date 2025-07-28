import React from 'react';
import { BookOpen, Headphones, PenTool, Mic, Brain, FileText } from 'lucide-react';

interface SkillProgress {
  name: string;
  progress: number;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
}

const ProgressSection: React.FC = () => {
  const skills: SkillProgress[] = [
    { name: 'קריאה', progress: 70, icon: BookOpen, color: 'text-green-600', bgColor: 'bg-green-50' },
    { name: 'דקדוק', progress: 45, icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { name: 'אוצר מילים', progress: 60, icon: Brain, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { name: 'דיבור', progress: 30, icon: Mic, color: 'text-teal-600', bgColor: 'bg-teal-50' },
    { name: 'כתיבה', progress: 25, icon: PenTool, color: 'text-pink-600', bgColor: 'bg-pink-50' },
    { name: 'האזנה', progress: 55, icon: Headphones, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  ];

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-gray-900">ההתקדמות שלך</h2>
        <div className="text-2xl">🏆</div>
      </div>
      
      <div className="grid grid-cols-3 gap-6">
        {skills.map((skill, index) => (
          <div key={index} className="text-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
            <div className={`w-16 h-16 ${skill.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-white shadow-sm`}>
              <skill.icon className={`w-8 h-8 ${skill.color}`} />
            </div>
            <div className="mb-4">
              <p className="text-base font-semibold text-gray-900 mb-1">{skill.name}</p>
              <p className="text-sm text-gray-500">{skill.progress}% הושלם</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full ${skill.color.replace('text-', 'bg-')} transition-all duration-500`}
                style={{ width: `${skill.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSection;