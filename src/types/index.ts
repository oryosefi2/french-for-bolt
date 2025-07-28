// Core types for the French learning system
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2';

export type SkillType = 'reading' | 'listening' | 'writing' | 'speaking' | 'vocabulary' | 'grammar';

export interface User {
  id: string;
  email: string;
  name: string;
  current_level: CEFRLevel;
  total_points: number;
  streak_days: number;
  last_activity: string;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  level: CEFRLevel;
  skill_type: SkillType;
  topic: string;
  score: number;
  completed_at: string;
  time_spent: number;
}

export interface VocabularyWord {
  id: string;
  french: string;
  english: string;
  level: CEFRLevel;
  topic: string;
  difficulty: number;
  pronunciation?: string;
}

export interface Exercise {
  id: string;
  type: SkillType;
  level: CEFRLevel;
  topic: string;
  content: any;
  created_at: string;
}

export interface DialogueResponse {
  text: string;
  audio_url: string;
  duration: number;
}

export interface GrammarRule {
  id: string;
  level: CEFRLevel;
  title: string;
  explanation: string;
  examples: string[];
}

export interface Topic {
  id: string;
  name: string;
  level: CEFRLevel;
  description: string;
  vocabulary_count: number;
}