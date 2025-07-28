import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';
import { format, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { UserProgress } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface ProgressChartProps {
  progress: UserProgress[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ progress }) => {
  // If no progress data, show a placeholder
  if (!progress || progress.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4" dir="rtl">
          התקדמות שבועית
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500" dir="rtl">
          <div className="text-center">
            <div className="text-4xl mb-2">📊</div>
            <p>אין עדיין נתוני התקדמות</p>
            <p className="text-sm mt-1">התחילו ללמוד כדי לראות את ההתקדמות שלכם</p>
          </div>
        </div>
      </div>
    );
  }
  // Prepare data for the last 7 days
  const getLast7DaysData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return format(date, 'dd/MM', { locale: fr });
    });

    const dailyScores = last7Days.map(day => {
      const dayProgress = progress.filter(p => {
        const progressDate = format(new Date(p.completed_at), 'dd/MM', { locale: fr });
        return progressDate === day;
      });
      
      if (dayProgress.length === 0) return 0;
      return dayProgress.reduce((sum, p) => sum + p.score, 0) / dayProgress.length;
    });

    return {
      labels: last7Days,
      datasets: [
        {
          label: 'Score moyen',
          data: dailyScores,
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.3,
          fill: true
        }
      ]
    };
  };

  // Prepare data for skills distribution
  const getSkillsData = () => {
    const skillCounts = progress.reduce((acc, p) => {
      acc[p.skill_type] = (acc[p.skill_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const skillLabels = {
      reading: 'Lecture',
      listening: 'Écoute',
      writing: 'Écriture',
      speaking: 'Oral',
      vocabulary: 'Vocabulaire',
      grammar: 'Grammaire'
    };

    const colors = [
      '#3B82F6', // blue
      '#8B5CF6', // purple
      '#10B981', // green
      '#EF4444', // red
      '#F59E0B', // amber
      '#6366F1'  // indigo
    ];

    return {
      labels: Object.keys(skillCounts).map(skill => skillLabels[skill as keyof typeof skillLabels]),
      datasets: [
        {
          data: Object.values(skillCounts),
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff'
        }
      ]
    };
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Progression des 7 derniers jours'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
      },
      title: {
        display: true,
        text: 'Répartition par compétence'
      }
    }
  };

  if (progress.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <p>Aucune donnée de progression disponible</p>
          <p className="text-sm mt-1">Commencez à faire des exercices pour voir vos statistiques</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <Line data={getLast7DaysData()} options={lineOptions} />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <Doughnut data={getSkillsData()} options={doughnutOptions} />
      </div>
    </div>
  );
};

export default ProgressChart;