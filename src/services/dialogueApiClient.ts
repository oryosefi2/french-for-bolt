import toast from 'react-hot-toast';
import type { CEFRLevel, DialogueResponse } from '../types';

export class DialogueApiClient {
  private baseUrl = import.meta.env.VITE_DIALOGUE_API_URL || 'http://localhost:5000';

  async generateDialogue(
    words: string[],
    level: CEFRLevel,
    topic?: string
  ): Promise<DialogueResponse> {
    try {
      console.log('🚀 שולח בקשה לשרת הדיאלוג:', {
        url: `${this.baseUrl}/api/create-dialogue`,
        baseUrl: this.baseUrl,
        words,
        topic
      });
      
      const response = await fetch(`${this.baseUrl}/api/create-dialogue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({
          words,
          topic
        })
      });

      console.log('📡 תגובת השרת:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ שגיאת שרת:', errorText);
        throw new Error(`Failed to generate dialogue: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 נתוני התגובה:', data);
      
      if (!data.success) {
        console.error('❌ יצירת הדיאלוג נכשלה:', data);
        throw new Error('Dialogue generation failed');
      }
      
      const audioUrl = data.audioUrl;
      console.log('🔊 URL אודיו:', audioUrl);
      
      // טיפול ב-URL האודיו
      let finalAudioUrl = '';
      
      if (audioUrl) {
        if (audioUrl.startsWith('http')) {
          // URL מלא
          finalAudioUrl = audioUrl;
        } else if (audioUrl.startsWith('/')) {
          // URL יחסי שמתחיל ב-/
          finalAudioUrl = `${this.baseUrl}${audioUrl}`;
        } else {
          // URL יחסי ללא /
          finalAudioUrl = `${this.baseUrl}/${audioUrl}`;
        }
        console.log('🔗 URL אודיו סופי:', finalAudioUrl);
      }
      
      return {
        text: data.dialogue,
        audio_url: finalAudioUrl,
        duration: data.duration || 0
      };
    } catch (error) {
      console.error('Dialogue API Error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          toast.error('לא ניתן להתחבר לשרת הדיאלוג - בדוק שהוא רץ');
        } else if (error.message.includes('CORS')) {
          toast.error('בעיית CORS - בדוק הגדרות השרת');
        } else {
          toast.error(`שגיאה ביצירת הדיאלוג: ${error.message}`);
        }
      } else {
        toast.error('שגיאה לא ידועה ביצירת הדיאלוג');
      }
      
      // Fallback mock response for development
      return {
        text: `Dialogue exemple pour les mots: ${words.join(', ')}. Sujet: ${topic}`,
        audio_url: '',
        duration: 30
      };
    }
  }

  async convertTextToSpeech(text: string): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/create-dialogue`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          words: [],
          topic: text
        })
      });

      if (!response.ok) {
        throw new Error('Failed to convert text to speech');
      }

      const data = await response.json();
      return data.audioUrl || '';
    } catch (error) {
      console.error('TTS API Error:', error);
      toast.error('Échec de la synthèse vocale');
      return '';
    }
  }
}

export const dialogueApiClient = new DialogueApiClient();