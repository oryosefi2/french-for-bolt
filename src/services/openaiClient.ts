import toast from 'react-hot-toast';
import type { CEFRLevel, SkillType } from '../types';

export class OpenAIClient {
  private apiKey: string;
  private baseUrl = 'https://api.openai.com/v1/chat/completions';

  constructor(apiKey: string = '') {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
    
    if (!this.apiKey) {
      console.warn('OpenAI API key not found. Please add VITE_OPENAI_API_KEY to your .env file');
    }
  }

  async generateExercise(
    level: CEFRLevel,
    skillType: SkillType,
    topic: string,
    vocabulary?: string[]
  ) {
    try {
      if (!this.apiKey) {
        console.error('OpenAI API key missing');
        toast.error('מפתח OpenAI חסר - בדוק את קובץ .env');
        throw new Error('OpenAI API key is required');
      }
      
      console.log('Generating exercise:', { level, skillType, topic });
      const prompt = this.buildPrompt(level, skillType, topic, vocabulary);
      console.log('Generated prompt:', prompt);
      
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a French language teacher specializing in CEFR-based instruction. Always respond with valid JSON only, no additional text or explanations.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1500
        })
      });

      console.log('OpenAI Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API Error:', response.status, errorText);
        
        if (response.status === 401) {
          toast.error('מפתח OpenAI לא תקין - בדוק את המפתח');
        } else if (response.status === 429) {
          toast.error('חרגת מהמכסה - נסה שוב מאוחר יותר');
        } else {
          toast.error(`שגיאה ביצירת התרגיל: ${response.status}`);
        }
        throw new Error(`OpenAI API Error: ${response.status}`);
      }

      const data = await response.json();
      console.log('OpenAI Response data:', data);
      
      const content = data.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error('No content received from OpenAI');
      }
      
      try {
        // Extract JSON from the response (handle cases where OpenAI adds extra text)
        let jsonContent = content;
        
        // Look for JSON block markers
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonContent = jsonMatch[1];
        } else {
          // Look for JSON object starting with {
          const jsonStart = content.indexOf('{');
          const jsonEnd = content.lastIndexOf('}');
          if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            jsonContent = content.substring(jsonStart, jsonEnd + 1);
          }
        }
        
        const parsedContent = JSON.parse(jsonContent);
        console.log('Parsed exercise:', parsedContent);
        return parsedContent;
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', content);
        console.error('Parse error:', parseError);
        toast.error('שגיאה בפענוח התגובה מ-OpenAI');
        throw new Error('Failed to parse OpenAI response');
      }
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          // Already handled above
        } else if (error.message.includes('Failed to fetch')) {
          toast.error('בעיית רשת - בדוק את החיבור לאינטרנט');
        } else {
          toast.error('שגיאה ביצירת התרגיל');
        }
      }
      throw error;
    }
  }

  private buildPrompt(
    level: CEFRLevel,
    skillType: SkillType,
    topic: string,
    vocabulary?: string[]
  ): string {
    const vocabularyText = vocabulary ? `Use these words: ${vocabulary.join(', ')}` : '';
    
    const prompts = {
      reading: `Create a ${level}-level French reading comprehension exercise about "${topic}". ${vocabularyText}
        Include:
        - A text passage (80-150 words for ${level})
        - 4 multiple choice questions
        - Correct answers
        Return in JSON format: {"passage": "...", "questions": [{"question": "...", "options": ["a", "b", "c", "d"], "correct": 0}]}`,
      
      listening: `Create a ${level}-level French listening exercise dialogue about "${topic}". ${vocabularyText}
        Include:
        - A dialogue between 2 people (60-120 words)
        - 3 comprehension questions
        - Extract key vocabulary words from the dialogue
        Return in JSON format: {"dialogue": "...", "questions": [{"question": "...", "options": ["a", "b", "c", "d"], "correct": 0}], "words": ["word1", "word2", "word3"]}`,
      
      writing: `Create a ${level}-level French writing exercise about "${topic}". ${vocabularyText}
        Include:
        - Writing prompt
        - 3 sentence completion exercises
        - Sample answer
        Return in JSON format: {"prompt": "...", "completions": [{"sentence": "Je suis...", "answer": "étudiant"}], "sample": "..."}`,
      
      vocabulary: `Create a ${level}-level French vocabulary exercise about "${topic}". ${vocabularyText}
        Include:
        - 8 vocabulary items with definitions
        - 4 matching exercises
        Return in JSON format: {"words": [{"french": "...", "english": "...", "example": "..."}], "matching": [{"french": "...", "options": ["a", "b", "c", "d"], "correct": 0}]}`,
      
      grammar: `Create a ${level}-level French grammar exercise about "${topic}". ${vocabularyText}
        Include:
        - Grammar rule explanation
        - 5 fill-in-the-blank exercises
        Return in JSON format: {"rule": "...", "exercises": [{"sentence": "Je ___ français", "answer": "parle", "options": ["parle", "parles", "parlons", "parlent"]}]}`,
      
      speaking: `Create a ${level}-level French speaking exercise about "${topic}". ${vocabularyText}
        Include:
        - Conversation scenario
        - 3 role-play prompts
        - Key phrases to use
        Return in JSON format: {"scenario": "...", "prompts": ["...", "...", "..."], "phrases": ["...", "...", "..."]}`
    };

    return prompts[skillType] || prompts.reading;
  }
}

export const openaiClient = new OpenAIClient();