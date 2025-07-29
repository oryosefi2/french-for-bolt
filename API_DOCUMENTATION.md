# 🔌 API Documentation - FrenchAI Platform

## 📋 סקירה כללית

ה-API של FrenchAI מספק ממשקים ליצירת תרגילים דינמיים, ניהול משתמשים, ומעקב התקדמות. כל ה-endpoints מוגנים באימות ותומכים ב-CORS.

**Base URL:** `https://your-backend-url.ngrok-free.app`

## 🔐 Authentication

כל הבקשות דורשות token של Supabase ב-header:
```http
Authorization: Bearer <supabase_jwt_token>
```

## 📚 Exercise Generation API

### 🎯 יצירת תרגיל דינמי

**POST** `/api/generate-exercise`

יוצר תרגיל מותאם אישית באמצעות AI לפי פרמטרים שצוין.

#### Request Body
```json
{
  "user_id": "string (UUID)",
  "level": "A1" | "A2" | "B1" | "B2",
  "skill_category": "comprehension_ecrite" | "comprehension_orale" | "production_ecrite" | "production_orale" | "vocabulaire" | "grammaire",
  "topic": "string",
  "difficulty": 1-5,
  "template_type": "reading_comprehension" | "grammar_exercise" | "vocabulary_exercise" | "listening_comprehension",
  "prompt": "string (optional)",
  "previous_attempts": "array (optional)"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "content": {
    "exercise_type": "reading" | "grammaire" | "vocabulaire",
    "level": "A1" | "A2" | "B1" | "B2",
    "topic": "string",
    "content": {
      "text": "string (passage text)",
      "questions": [
        {
          "question": "string",
          "type": "multiple_choice" | "true_false",
          "options": ["string"] (if multiple_choice),
          "correct": "number | boolean"
        }
      ]
    },
    "exercise_content": {
      "text": "string",
      "questions": [
        {
          "question_in_Hebrew": "string",
          "sentence": "string",
          "correct_answer": "string"
        }
      ]
    },
    "answers": {
      "1": "string",
      "2": "string",
      "3": "string"
    },
    "metadata": {
      "generated_at": "timestamp",
      "estimated_duration": "number (minutes)",
      "focus_areas": ["string"]
    }
  }
}
```

#### Response (Error - 400/500)
```json
{
  "success": false,
  "error": "string",
  "details": "string (optional)"
}
```

#### Example Request
```bash
curl -X POST https://your-backend-url.ngrok-free.app/api/generate-exercise \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "user_id": "123e4567-e89b-12d3-a456-426614174000",
    "level": "A1",
    "skill_category": "comprehension_ecrite",
    "topic": "famille",
    "difficulty": 3,
    "template_type": "reading_comprehension"
  }'
```

### 🗣️ יצירת דיאלוג

**POST** `/api/generate-dialogue`

יוצר דיאלוג לתרגילי האזנה ודיבור.

#### Request Body
```json
{
  "user_id": "string (UUID)",
  "level": "A1" | "A2" | "B1" | "B2",
  "scenario": "string",
  "characters": "number",
  "duration": "short" | "medium" | "long",
  "topics": ["string"]
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "dialogue": {
    "id": "string",
    "scenario": "string",
    "characters": [
      {
        "name": "string",
        "description": "string"
      }
    ],
    "conversation": [
      {
        "speaker": "string",
        "text": "string",
        "translation": "string (Hebrew)",
        "audio_url": "string (optional)"
      }
    ],
    "comprehension_questions": [
      {
        "question": "string",
        "question_hebrew": "string",
        "type": "multiple_choice" | "true_false",
        "options": ["string"],
        "correct": "number | boolean"
      }
    ],
    "vocabulary": [
      {
        "french": "string",
        "hebrew": "string",
        "context": "string"
      }
    ]
  }
}
```

### 🎵 יצירת אודיו

**POST** `/api/generate-audio`

מפיק קבצי אודיו לטקסט צרפתי.

#### Request Body
```json
{
  "text": "string",
  "voice": "male" | "female",
  "speed": "slow" | "normal" | "fast",
  "format": "mp3" | "wav"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "audio": {
    "url": "string",
    "duration": "number (seconds)",
    "format": "string",
    "file_size": "number (bytes)"
  }
}
```

## 📊 Analytics & Performance API

### 📈 ניתוח ביצועי משתמש

**POST** `/api/analyze-performance`

מנתח את ביצועי המשתמש ומספק המלצות.

#### Request Body
```json
{
  "user_id": "string (UUID)",
  "exercise_attempts": [
    {
      "exercise_id": "string",
      "skill_type": "string",
      "level": "string",
      "score": "number",
      "time_spent": "number",
      "completed_at": "timestamp",
      "answers": "object"
    }
  ],
  "analysis_type": "comprehensive" | "skill_specific" | "progress_tracking"
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "analysis": {
    "overall_performance": {
      "average_score": "number",
      "improvement_trend": "improving" | "stable" | "declining",
      "consistency_rating": "number (1-5)",
      "total_time_invested": "number (minutes)"
    },
    "skill_breakdown": {
      "reading": {
        "score": "number",
        "exercises_completed": "number",
        "strength_areas": ["string"],
        "improvement_areas": ["string"]
      },
      "grammar": {
        "score": "number",
        "exercises_completed": "number", 
        "common_mistakes": ["string"],
        "mastered_concepts": ["string"]
      }
    },
    "recommendations": {
      "next_level_readiness": "boolean",
      "suggested_focus_areas": ["string"],
      "recommended_exercise_types": ["string"],
      "study_plan": {
        "daily_minutes": "number",
        "weekly_goals": ["string"],
        "priority_skills": ["string"]
      }
    },
    "progress_indicators": {
      "cefr_level_progress": "number (0-100)",
      "skill_mastery": {
        "reading": "number (0-100)",
        "grammar": "number (0-100)",
        "vocabulary": "number (0-100)"
      },
      "learning_velocity": "number",
      "retention_rate": "number (0-100)"
    }
  }
}
```

### 💾 שמירת ניסיון תרגיל

**POST** `/api/save-exercise-attempt`

שומר את פרטי ביצוע התרגיל במסד הנתונים.

#### Request Body
```json
{
  "user_id": "string (UUID)",
  "exercise_data": {
    "type": "string",
    "content": "object",
    "level": "string",
    "skill": "string",
    "topic": "string"
  },
  "user_responses": {
    "answers": "object",
    "time_spent": "number",
    "hints_used": "number",
    "attempt_count": "number"
  },
  "performance": {
    "score": "number (0-100)",
    "correct_answers": "number",
    "total_questions": "number",
    "completion_rate": "number (0-100)"
  },
  "metadata": {
    "started_at": "timestamp",
    "completed_at": "timestamp",
    "device_info": "string",
    "session_id": "string"
  }
}
```

#### Response (Success - 201)
```json
{
  "success": true,
  "attempt_id": "string (UUID)",
  "points_earned": "number",
  "achievements_unlocked": ["string"],
  "next_recommendations": {
    "suggested_exercises": ["string"],
    "focus_areas": ["string"]
  }
}
```

## 🎯 Specialized Endpoints

### 🧠 AI Prompt Management

**GET** `/api/prompts/templates`

מחזיר רשימת תבניות prompts זמינות.

#### Response (Success - 200)
```json
{
  "templates": {
    "reading_comprehension": {
      "A1": "string",
      "A2": "string",
      "B1": "string",
      "B2": "string"
    },
    "grammar_exercise": {
      "articles": "string",
      "verb_conjugation": "string",
      "sentence_structure": "string"
    },
    "vocabulary": {
      "themed": "string",
      "contextual": "string",
      "progressive": "string"
    }
  }
}
```

**POST** `/api/prompts/custom`

יוצר prompt מותאם אישית.

#### Request Body
```json
{
  "user_id": "string (UUID)",
  "base_template": "string",
  "customizations": {
    "difficulty_adjustment": "string",
    "topic_focus": ["string"],
    "learning_style": "visual" | "auditory" | "kinesthetic",
    "user_preferences": "object"
  },
  "previous_performance": "object (optional)"
}
```

### 📱 Mobile API Extensions

**POST** `/api/mobile/sync`

סנכרון נתונים למכשירים ניידים.

#### Request Body
```json
{
  "user_id": "string (UUID)",
  "device_id": "string",
  "last_sync": "timestamp",
  "offline_data": {
    "completed_exercises": ["object"],
    "progress_updates": ["object"],
    "user_preferences": "object"
  }
}
```

#### Response (Success - 200)
```json
{
  "success": true,
  "sync_result": {
    "conflicts_resolved": "number",
    "new_exercises": ["object"],
    "updated_progress": "object",
    "next_sync_recommended": "timestamp"
  }
}
```

## 🔧 Utility Endpoints

### 🏥 Health Check

**GET** `/api/health`

בדיקת תקינות השרת.

#### Response (Success - 200)
```json
{
  "status": "healthy",
  "timestamp": "2025-07-29T12:00:00Z",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "openai_api": "available",
    "external_services": "operational"
  },
  "metrics": {
    "uptime": "number (seconds)",
    "response_time": "number (ms)",
    "active_users": "number"
  }
}
```

### 📊 System Statistics

**GET** `/api/stats/system`

סטטיסטיקות מערכת (דורש הרשאות admin).

#### Response (Success - 200)
```json
{
  "system_stats": {
    "total_users": "number",
    "active_users_today": "number",
    "exercises_generated_today": "number",
    "average_session_duration": "number (minutes)",
    "most_popular_levels": ["string"],
    "most_popular_skills": ["string"],
    "performance_metrics": {
      "avg_response_time": "number (ms)",
      "error_rate": "number (percentage)",
      "database_queries_per_minute": "number"
    }
  }
}
```

## ⚠️ Error Handling

### Standard Error Responses

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": "Additional technical details",
    "timestamp": "2025-07-29T12:00:00Z",
    "request_id": "string (UUID)"
  }
}
```

### Common Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_TOKEN` | 401 | אימות נכשל |
| `INSUFFICIENT_PERMISSIONS` | 403 | אין הרשאות מספיקות |
| `RESOURCE_NOT_FOUND` | 404 | המשאב לא נמצא |
| `VALIDATION_ERROR` | 400 | שגיאת ולידציה |
| `RATE_LIMIT_EXCEEDED` | 429 | חרגת מהגבלת קצב |
| `AI_SERVICE_UNAVAILABLE` | 503 | שירות AI לא זמין |
| `DATABASE_ERROR` | 500 | שגיאת מסד נתונים |

## 🔄 Rate Limiting

- **Exercise Generation:** 10 בקשות לדקה למשתמש
- **Audio Generation:** 5 בקשות לדקה למשתמש  
- **Analysis Requests:** 20 בקשות לדקה למשתמש
- **General API:** 100 בקשות לדקה למשתמש

## 📝 SDKs & Integration Examples

### JavaScript/TypeScript
```typescript
// FrenchAI SDK Example
import { FrenchAIClient } from 'frenchai-sdk';

const client = new FrenchAIClient({
  baseURL: 'https://your-backend-url.ngrok-free.app',
  apiKey: 'your-supabase-jwt-token'
});

// Generate exercise
const exercise = await client.exercises.generate({
  level: 'A1',
  skillCategory: 'comprehension_ecrite',
  topic: 'famille',
  difficulty: 3
});

// Save attempt
const result = await client.attempts.save({
  exerciseId: exercise.id,
  userResponses: { answers: { q1: 0, q2: true } },
  score: 85,
  timeSpent: 300
});
```

### Python
```python
# Python SDK Example
from frenchai_client import FrenchAIClient

client = FrenchAIClient(
    base_url='https://your-backend-url.ngrok-free.app',
    api_key='your-supabase-jwt-token'
)

# Generate exercise
exercise = client.exercises.generate(
    level='A1',
    skill_category='comprehension_ecrite',
    topic='famille',
    difficulty=3
)

# Analyze performance
analysis = client.analytics.analyze_performance(
    user_id='user-123',
    exercise_attempts=user_attempts
)
```

## 🔗 Webhooks (Beta)

### Progress Update Webhook
URL מותאמת אישית תקבל notifications על התקדמות משתמשים.

#### Payload Example
```json
{
  "event": "progress_updated",
  "user_id": "string (UUID)",
  "data": {
    "level_completed": "A1",
    "new_level": "A2",
    "total_score": "number",
    "exercises_completed": "number",
    "time_invested": "number (minutes)"
  },
  "timestamp": "2025-07-29T12:00:00Z"
}
```

---

📚 **API Documentation זה מספק מדריך מקיף לכל ה-endpoints הזמינים במערכת FrenchAI.**
