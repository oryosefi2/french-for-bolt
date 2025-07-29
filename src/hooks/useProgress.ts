import { useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
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
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (error) {
        console.error('Error fetching progress:', error);
        setProgress([]);
      } else {
        setProgress(data || []);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching progress:', error);
      setProgress([]);
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
      const progressData = {
        user_id: userId,
        level,
        skill_type: skillType,
        topic,
        score,
        time_spent: timeSpent,
        exercise_data: null // יכול להכיל מידע נוסף על התרגיל
      };

      const { data, error } = await supabase
        .from('user_progress')
        .insert([progressData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      // עדכון המצב המקומי
      setProgress(prev => [data, ...prev]);
      
      // עדכון נקודות המשתמש
      const points = Math.round(score * 10);
      await updateUserPoints(points);
      
      toast.success(`+${points} points!`);
    } catch (error: any) {
      console.error('Error saving progress:', error);
      toast.error('שגיאה בשמירת ההתקדמות');
    }
  };

  const updateUserPoints = async (points: number) => {
    if (!userId) return;

    try {
      // First get current points
      const { data: currentUser, error: fetchError } = await supabase
        .from('users')
        .select('total_points')
        .eq('id', userId)
        .single();

      if (fetchError) {
        console.error('Error fetching current points:', fetchError);
        return;
      }

      // Update with new total
      const newTotal = (currentUser.total_points || 0) + points;
      const { error } = await supabase
        .from('users')
        .update({ 
          total_points: newTotal,
          last_activity: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating user points:', error);
      }
    } catch (error) {
      console.error('Error updating user points:', error);
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