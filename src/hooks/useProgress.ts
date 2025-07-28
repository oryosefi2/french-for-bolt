import { useState, useEffect } from 'react';
import type { UserProgress, CEFRLevel, SkillType } from '../types';
import toast from 'react-hot-toast';

export const useProgress = (userId: string | undefined) => {
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchProgress();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchProgress = async () => {
    if (!userId) return;

    try {
      // For now, we'll use mock data since we haven't created the progress table yet
      // In the future, this will fetch from Supabase
      setProgress([]);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress:', error);
      setLoading(false);
    }
  };

  const addProgress = async (
    level: CEFRLevel,
    skillType: SkillType,
    topic: string,
    score: number,
    timeSpent: number
  ) => {
    if (!userId) return;

    try {
      const newProgress = {
        id: Date.now().toString(),
        user_id: userId,
        level,
        skill_type: skillType,
        topic,
        score,
        time_spent: timeSpent,
        completed_at: new Date().toISOString()
      };

      setProgress(prev => [newProgress, ...prev]);
      
      // Update user points
      const points = Math.round(score * 10);
      
      toast.success(`+${points} points!`);
    } catch (error: any) {
      toast.error('Erreur lors de l\'enregistrement du progrès');
    }
  };

  const getProgressBySkill = (skillType: SkillType) => {
    return progress.filter(p => p.skill_type === skillType);
  };

  const getProgressByLevel = (level: CEFRLevel) => {
    return progress.filter(p => p.level === level);
  };

  const getAverageScore = (skillType?: SkillType) => {
    const filtered = skillType ? getProgressBySkill(skillType) : progress;
    if (filtered.length === 0) return 0;
    return filtered.reduce((sum, p) => sum + p.score, 0) / filtered.length;
  };

  const getTotalTimeSpent = () => {
    return progress.reduce((sum, p) => sum + p.time_spent, 0);
  };

  const getStreakDays = () => {
    const today = new Date();
    let streak = 0;
    const uniqueDays = [...new Set(progress.map(p => 
      new Date(p.completed_at).toDateString()
    ))].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    for (let i = 0; i < uniqueDays.length; i++) {
      const dayDiff = Math.floor(
        (today.getTime() - new Date(uniqueDays[i]).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (dayDiff === i) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  return {
    progress,
    loading,
    addProgress,
    getProgressBySkill,
    getProgressByLevel,
    getAverageScore,
    getTotalTimeSpent,
    getStreakDays,
    refetch: () => {}
  };
};