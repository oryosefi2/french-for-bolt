from openai import OpenAI
import json
import os
from typing import Dict, Any, List

# הגדרת OpenAI client
client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))

def generate_exercise(
    level: str,
    skill_category: str, 
    topic: str,
    difficulty: int,
    template_type: str,
    custom_prompt: str = ""
) -> Dict[str, Any]:
    """
    יצירת תרגיל דינמי עם OpenAI
    """
    print(f"🎯 יוצר תרגיל: רמה {level}, מיומנות {skill_category}, נושא {topic}")
    
    prompt = build_exercise_prompt(level, skill_category, topic, difficulty, template_type, custom_prompt)
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a French language teacher who creates CEFR A1-A2 level exercises "
                        "for DELF exam preparation. Always provide reading/writing/speaking **text in French only**, "
                        "but instructions/questions can be in Hebrew if required. Do not translate the French text to Hebrew."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            max_tokens=1500,
            temperature=0.7,
            response_format={"type": "json_object"}
        )
        
        content = json.loads(response.choices[0].message.content)
        validated_content = validate_exercise_content(content, skill_category)
        
        return {
            "content": validated_content,
            "correct_answers": content.get("correct_answers", []),
            "explanation": content.get("explanation", ""),
            "usage": {
                "prompt_tokens": response.usage.prompt_tokens,
                "completion_tokens": response.usage.completion_tokens,
                "total_tokens": response.usage.total_tokens
            }
        }

    except Exception as e:
        print(f"❌ שגיאה ב-OpenAI: {e}")
        return get_fallback_exercise(level, skill_category, topic)


def build_exercise_prompt(level: str, skill_category: str, topic: str, difficulty: int, template_type: str, custom_prompt: str) -> str:
    """
    בניית prompt מותאם לרמה ולמיומנות, כתוב באנגלית כדי להבטיח תגובה בצרפתית
    """
    level_specs = {
        "A1": {
            "word_limit": 80,
            "sentence_structure": "short and simple sentences",
            "vocabulary": "basic and common vocabulary",
            "grammar": "present tense, basic sentence structures",
            "questions": 3
        },
        "A2": {
            "word_limit": 120,
            "sentence_structure": "medium-length sentences with clear structure",
            "vocabulary": "expanded everyday vocabulary",
            "grammar": "past tense, near future",
            "questions": 4
        }
    }

    specs = level_specs.get(level, level_specs["A1"])

    if skill_category == "comprehension_ecrite":
        prompt = f"""
Create a reading comprehension exercise for CEFR level {level} on the topic of "{topic}".

Requirements:
1. A short text of approximately {specs['word_limit']} words, written **entirely in French**
2. {specs['questions']} multiple-choice or true/false questions in **Hebrew**
3. Use only vocabulary and grammar appropriate for level {level}
4. Text should be interesting and culturally relevant
5. Difficulty: {difficulty}/5

Return the result as JSON in the following format:
{{
  "text": "French text goes here",
  "questions": [
    {{
      "type": "multiple_choice",
      "question": "שאלה בעברית",
      "options": ["אפשרות 1", "אפשרות 2", "אפשרות 3", "אפשרות 4"],
      "correct": 0
    }}
  ],
  "correct_answers": [0, 1, true],
  "explanation": "Brief explanation in English"
}}
"""

    elif skill_category == "production_ecrite":
        prompt = f"""
Create a writing exercise for CEFR level {level} on the topic "{topic}".

Requirements:
1. Instructions in **Hebrew**
2. Suggested writing length: {specs['word_limit']} words
3. Provide helpful phrases in **French**
4. Include evaluation criteria
5. Writing should be in **French** only
6. Difficulty: {difficulty}/5

Return JSON:
{{
  "instruction": "הוראות התרגיל בעברית",
  "word_limit": {specs['word_limit']},
  "useful_phrases": ["Je pense que...", "À mon avis...", "Il me semble que..."],
  "evaluation_criteria": ["קריטריון 1", "קריטריון 2", ...],
  "correct_answers": ["sample_answer"],
  "explanation": "Short explanation in English"
}}
"""

    elif skill_category == "production_orale":
        prompt = f"""
Create a speaking prompt for CEFR level {level} on the topic "{topic}".

Requirements:
1. Prompt instructions in Hebrew
2. Suggested talking points in French
3. Recommended speaking duration
4. Difficulty: {difficulty}/5

Return JSON:
{{
  "speaking_prompt": "הוראות לדיבור בעברית",
  "key_points": ["Présentez-vous", "Parlez de votre famille", "Décrivez vos loisirs"],
  "duration": "1-2 דקות",
  "correct_answers": ["completed"],
  "explanation": "Short explanation in English"
}}
"""

    else:
        prompt = f"""
Create an exercise of type '{skill_category}' for CEFR level {level} on the topic "{topic}". 
Ensure all core content (text, answers) is in French. Questions can be in Hebrew. 
Difficulty level: {difficulty}/5. Return result in JSON format.
"""

    if custom_prompt:
        prompt += f"\n\nAdditional Instructions:\n{custom_prompt}"
    
    return prompt


def validate_exercise_content(content: Dict[str, Any], skill_category: str) -> Dict[str, Any]:
    """
    וידוא שהתוכן שנוצר תקין
    """
    if skill_category == "comprehension_ecrite":
        if "text" not in content or "questions" not in content:
            raise ValueError("Missing text or questions")
        if "correct_answers" not in content:
            correct_answers = []
            for question in content["questions"]:
                if question.get("type") == "multiple_choice":
                    correct_answers.append(question.get("correct", 0))
                elif question.get("type") == "true_false":
                    correct_answers.append(question.get("correct", True))
            content["correct_answers"] = correct_answers

    elif skill_category == "production_ecrite":
        if "instruction" not in content:
            raise ValueError("Missing writing instructions")

    return content


def get_fallback_exercise(level: str, skill_category: str, topic: str) -> Dict[str, Any]:
    """
    תרגיל fallback במקרה של כשל ב-OpenAI
    """
    if skill_category == "comprehension_ecrite":
        return {
            "content": {
                "text": "Bonjour ! Je m'appelle Marie. J'ai 25 ans. Je suis française. J'habite à Lyon avec ma famille. J'aime lire des livres et écouter de la musique. Le matin, je prends le métro pour aller au travail. Le soir, j'aime cuisiner avec mes amis.",
                "questions": [
                    {
                        "type": "multiple_choice",
                        "question": "איך קוראים לבחורה?",
                        "options": ["Sophie", "Marie", "Julie", "Anne"],
                        "correct": 1
                    },
                    {
                        "type": "true_false", 
                        "question": "מארי גרה בליון",
                        "correct": True
                    },
                    {
                        "type": "multiple_choice",
                        "question": "מה מארי אוהבת לעשות?",
                        "options": ["לרקוד", "לקרוא ולהקשיב למוזיקה", "לשחק כדורגל", "לצייר"],
                        "correct": 1
                    }
                ]
            },
            "correct_answers": [1, True, 1],
            "explanation": "Basic A1 level reading comprehension exercise"
        }
    
    else:
        return {
            "content": {
                "instruction": f"כתוב על {topic} ברמה {level} בצרפתית",
                "word_limit": 50 if level == "A1" else 80,
                "useful_phrases": ["Je pense que...", "À mon avis...", "Il me semble que..."]
            },
            "correct_answers": ["sample_answer"],
            "explanation": "Basic writing task"
        }
