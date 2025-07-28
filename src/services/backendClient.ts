// Backend API Client for French Learning System

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5050';

export interface ExerciseRequest {
  level: string;
  skill_category: string;
  topic: string;
  difficulty: number;
  template_type: string;
  prompt?: string;
}

export interface ExerciseResponse {
  success: boolean;
  content: any;
  correct_answers: any;
  explanation?: string;
  usage?: any;
  error?: string;
}

export interface DialogueRequest {
  words: string[];
  topic: string;
}

export interface DialogueResponse {
  success: boolean;
  dialogue: string;
  audioUrl?: string;
  error?: string;
}

export interface PerformanceRequest {
  user_id: string;
  skill_category: string;
  level: string;
}

export interface ExerciseAttempt {
  user_id: string;
  exercise_type: string;
  level: string;
  skill_category: string;
  score: number;
  time_spent: number;
  answers: any;
  correct_answers: any;
}

class BackendClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = BACKEND_URL;
  }

  async generateExercise(request: ExerciseRequest): Promise<ExerciseResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate-exercise`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error generating exercise:', error);
      return {
        success: false,
        content: null,
        correct_answers: null,
        error: 'שגיאה ביצירת התרגיל'
      };
    }
  }

  async createDialogue(request: DialogueRequest): Promise<DialogueResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/create-dialogue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating dialogue:', error);
      return {
        success: false,
        dialogue: '',
        error: 'שגיאה ביצירת הדיאלוג'
      };
    }
  }

  async analyzePerformance(request: PerformanceRequest) {
    try {
      const response = await fetch(`${this.baseUrl}/api/analyze-performance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error analyzing performance:', error);
      return {
        success: false,
        error: 'שגיאה בניתוח הביצועים'
      };
    }
  }

  async saveExerciseAttempt(attempt: ExerciseAttempt) {
    try {
      const response = await fetch(`${this.baseUrl}/api/save-exercise-attempt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(attempt),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error saving exercise attempt:', error);
      return {
        success: false,
        error: 'שגיאה בשמירת התוצאות'
      };
    }
  }

  async checkHealth() {
    try {
      const response = await fetch(`${this.baseUrl}/api/health`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return {
        status: 'error',
        error: 'Backend לא זמין'
      };
    }
  }

  getAudioUrl(filename: string): string {
    return `${this.baseUrl}/api/audio/${filename}`;
  }
}

export const backendClient = new BackendClient();
