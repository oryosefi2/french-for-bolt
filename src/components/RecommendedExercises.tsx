import React from 'react';
import { BookOpen, Headphones, Clock, ArrowLeft } from 'lucide-react';

interface Exercise {
  id: string;
  title: string;
  type: string;
  duration: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  isActive: boolean;
}

const RecommendedExercises: React.FC = () => {
  const exercises: Exercise[] = [
    {
      id: '1',
      title: 'קריאה - משפחה וחברים',
      type: 'תרגיל קריאה',
      duration: '10 דקות',
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      isActive: true
    },
    {
      id: '2',
      title: 'האזנה - שיחות יומיומיות',
      type: 'תרגיל האזנה',
      duration: '8 דקות',
      icon: Headphones,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      isActive: true
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-gray-900">תרגילים מומלצים עבורך</h2>
        <div className="text-2xl">📅</div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="relative">
            <div className="bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-2xl p-8 text-right hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 ${exercise.bgColor} rounded-2xl flex items-center justify-center shadow-sm`}>
                  <exercise.icon className={`w-8 h-8 ${exercise.color}`} />
                </div>
                <div className="flex-1 mr-6">
                  <h3 className="font-bold text-gray-900 mb-2 text-lg">{exercise.title}</h3>
                  <p className="text-sm text-gray-700 mb-3">{exercise.type}</p>
                  <div className="flex items-center justify-end text-sm text-gray-600">
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{exercise.duration}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-yellow-500/20">
                <div className={`px-3 py-1 ${exercise.isActive ? 'bg-green-500' : 'bg-gray-500'} rounded-full`}>
                  <span className="text-white text-xs font-medium">
                    {exercise.isActive ? 'פעיל' : 'לא פעיל'}
                  </span>
                </div>
                <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-medium transition-all hover:scale-105 flex items-center shadow-sm">
                  <ArrowLeft className="w-5 h-5 ml-3" />
                  התחל תרגיל
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedExercises;