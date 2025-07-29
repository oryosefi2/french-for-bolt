# 🇫🇷 FrenchAI - מערכת למידת צרפתית מתקדמת

פלטפורמה מקיפה ללימוד צרפתית המבוססת על בינה מלאכותית, עם ממשק עברי מלא ומערכת התקדמות מתקדמת.

## ✨ פיצ'רים עיקריים

### 🎯 מערכת לימוד מבוססת CEFR
- **4 רמות** - A1, A2, B1, B2 לפי התקן האירופי
- **6 כישורי למידה** - קריאה, האזנה, כתיבה, דיבור, אוצר מילים, דקדוק
- **ממשק עברי מלא** - תמיכה RTL מושלמת עם תרגום כל התוכן
- **מעקב התקדמות חכם** - אנליטיקה מפורטת של הביצועים

### 🤖 בינה מלאכותית מתקדמת
- **תרגילים דינמיים** - יצירת תרגילים מותאמים אישית באמצעות OpenAI GPT-4
- **קושי אדפטיבי** - התאמת רמת הקושי לפי ביצועי המשתמש
- **סוגי תרגילים מגוונים** - הבנת הנקרא, השלמת דקדוק, אוצר מילים
- **משובים מיידיים** - ציון אוטומטי עם הסברים והמלצות

### 👤 ניהול משתמשים מתקדם
- **אימות מאובטח** - מערכת הרשמה והתחברות דרך Supabase
- **פרופילים מותאמים** - מעקב נקודות, רצף ימי למידה, הישגים
- **ניהול רמות** - מעבר בין רמות CEFR עם המלצות מותאמות
- **דוחות ביצועים** - גרפים וסטטיסטיקות מפורטות

### 🎮 חוויית משתמש מרתקת
- **מערכת נקודות** - צבירת נקודות וסטריקים יומיים
- **הישגים ובאדג'ים** - פרסים על השגת יעדי למידה
- **ממשק אינטואיטיבי** - עיצוב מודרני וידידותי למשתמש
- **רספונסיבי מלא** - עובד מושלם על כל המכשירים

## 🏗️ ארכיטקטורה טכנית

### Frontend (React + TypeScript)
```
Framework: React 18 + TypeScript + Vite
Styling: Tailwind CSS + Lucide Icons
State Management: React Hooks + Context
Charts: Chart.js + React-ChartJS-2
Notifications: React Hot Toast
```

### Backend (Python Flask + AI)
```
Server: Flask + CORS
AI Engine: OpenAI GPT-4 API
Exercise Generation: Custom AI prompts
External Server: Ngrok tunnel
```

### Database & Auth (Supabase)
```
Database: PostgreSQL with RLS
Authentication: Supabase Auth
Real-time: Live subscriptions
Security: Row Level Security policies
```

## 📁 מבנה הפרויקט המלא

```
project/
├── 📂 src/                          # Frontend React
│   ├── 📂 components/               # רכיבי React
│   │   ├── AuthForm.tsx            # טופס התחברות/הרשמה
│   │   ├── ExerciseRenderer.tsx    # מנוע תצוגת תרגילים
│   │   ├── Header.tsx              # כותרת עם מידע משתמש
│   │   ├── Sidebar.tsx             # תפריט ניווט צדדי
│   │   ├── LevelSelector.tsx       # בחירת רמת CEFR
│   │   ├── SkillCard.tsx          # כרטיסי כישורים
│   │   ├── ProgressChart.tsx       # גרפי התקדמות
│   │   ├── StatsCard.tsx          # כרטיסי סטטיסטיקה
│   │   └── AdvancedExerciseOptions.tsx # אפשרויות תרגיל מתקדמות
│   ├── 📂 pages/                   # דפי האפליקציה
│   │   ├── Dashboard.tsx           # דשבורד ראשי
│   │   ├── HebrewDashboard.tsx     # מעטפת עברית
│   │   ├── ExercisePage.tsx        # דף ביצוע תרגילים
│   │   ├── ReadingPage.tsx         # דף תרגילי קריאה
│   │   ├── GrammarPage.tsx         # דף תרגילי דקדוק
│   │   ├── VocabularyPage.tsx      # דף אוצר מילים
│   │   ├── ListeningPage.tsx       # דף תרגילי האזנה
│   │   ├── WritingPage.tsx         # דף תרגילי כתיבה
│   │   └── SpeakingPage.tsx        # דף תרגילי דיבור
│   ├── 📂 hooks/                   # React Hooks מותאמים
│   │   ├── useAuth.ts              # לוגיקת אימות
│   │   ├── useProgress.ts          # מעקב התקדמות
│   │   └── useGlobalLevel.ts       # ניהול רמות גלובלי
│   ├── 📂 services/                # שירותי API
│   │   ├── openaiClient.ts         # אינטגרציה עם OpenAI
│   │   └── dialogueApiClient.ts    # API שיחות
│   ├── 📂 types/                   # הגדרות TypeScript
│   │   └── index.ts                # ממשקים וטיפוסים
│   ├── 📂 config/                  # קובצי תצורה
│   │   └── supabase.ts             # הגדרות Supabase
│   └── 📂 data/                    # נתונים סטטיים
│       └── vocabularyData.ts       # מילון אוצר מילים
├── 📂 backend/                     # Backend Python
│   ├── app.py                      # שרת Flask ראשי
│   ├── 📂 services/                # שירותי Backend
│   │   ├── exercise_generator.py   # מנוע יצירת תרגילים
│   │   ├── dialogue.py             # שירות דיאלוגים
│   │   ├── audio.py                # עיבוד אודיו
│   │   ├── performance_analyzer.py # ניתוח ביצועים
│   │   └── exercise_saver.py       # שמירת תרגילים
│   ├── requirements.txt            # תלויות Python
│   ├── .env                        # משתני סביבה
│   └── 📂 venv/                    # סביבה וירטואלית
├── 📂 supabase/                    # Database & Auth
│   └── 📂 migrations/              # סקריפטי מיגרציה
│       ├── 20250728110801_empty_cake.sql      # טבלת users
│       ├── 20250728120826_shrill_flower.sql   # RLS policies
│       ├── 20250728121024_shrill_mode.sql     # תיקוני אבטחה
│       ├── 20250728121204_falling_rice.sql    # הגדרות RLS
│       ├── 20250728150000_add_exercise_attempts_table.sql # טבלת ניסיונות
│       └── 20250729_progress_table.sql        # טבלת התקדמות
├── 📋 README.md                    # תיעוד מלא
├── 📋 DEVELOPMENT_PLAN.md          # תכנית פיתוח
├── 📋 DATABASE_VERIFICATION.sql    # בדיקות מסד נתונים
├── 📦 package.json                 # תלויות Frontend
├── 🔧 vite.config.ts              # הגדרות Vite
├── 🎨 tailwind.config.js          # הגדרות Tailwind
└── 🔒 .env                        # משתני סביבה
```

## 💾 מבנה מסד הנתונים

### � טבלת Users
```sql
users (
  id: UUID (PK, מקושר ל-Supabase Auth)
  email: TEXT (ייחודי)
  name: TEXT (שם המשתמש)
  current_level: TEXT (A1/A2/B1/B2)
  total_points: INTEGER (סך הנקודות)
  streak_days: INTEGER (רצף ימי למידה)
  last_activity: TIMESTAMP (פעילות אחרונה)
  created_at: TIMESTAMP (תאריך יצירה)
)
```

### 📊 טבלת User Progress
```sql
user_progress (
  id: UUID (PK)
  user_id: UUID (FK → users.id)
  level: TEXT (רמת CEFR בזמן התרגיל)
  skill_type: TEXT (סוג הכישור)
  topic: TEXT (נושא התרגיל)
  score: INTEGER (ציון 0-100)
  time_spent: INTEGER (זמן בשניות)
  exercise_data: JSONB (נתוני התרגיל המלאים)
  completed_at: TIMESTAMP (זמן סיום)
)
```

### 📝 טבלת Exercise Attempts
```sql
exercise_attempts (
  id: UUID (PK)
  user_id: UUID (FK → users.id)
  skill: TEXT (סוג הכישור)
  level: TEXT (רמת קושי)
  score: INTEGER (ציון 0-100)
  feedback: TEXT (משוב מפורט)
  exercise_data: JSONB (נתוני התרגיל)
  time_spent: INTEGER (זמן בשניות)
  created_at: TIMESTAMP (זמן יצירה)
)
```

## 🎯 סוגי תרגילים נתמכים

### 📖 הבנת הנקרא (Reading Comprehension)
- **טקסטים מותאמים רמה** - קטעים באורך משתנה לפי רמת CEFR
- **שאלות בחירה מרובה** - 2-4 אפשרויות תשובה
- **שאלות נכון/לא נכון** - בדיקת הבנה בסיסית
- **ציון אוטומטי** - משוב מיידי עם הסברים

### 📝 השלמת דקדוק (Grammar Completion)
- **מאמרים מוגדרים** - le, la, l', les
- **מאמרים בלתי מוגדרים** - un, une, des
- **הקשר במשפט** - השלמה בהתבסס על הקשר
- **הסברי דקדוק** - חוקים ודוגמאות

### 🗣️ אוצר מילים (Vocabulary)
- **התאמת מילים** - צרפתית ↔ עברית
- **מילים בהקשר** - משפטי דוגמה
- **רמות קושי** - התאמה לרמת CEFR
- **חזרה מרווחת** - מילים לפי ביצועים

### 🎧 האזנה (בפיתוח)
- **דיאלוגים אותנטיים** - שיחות יומיומיות
- **זיהוי דיבור** - טכנולוגיית Speech Recognition
- **תרגילי הבנה** - שאלות על תוכן האודיו

### ✍️ כתיבה (בפיתוח)
- **תרגילי כתיבה מונחית** - עם הנחיות ברורות
- **תיקון דקדוק אוטומטי** - זיהוי וטיפול בשגיאות
- **שיפור סגנון** - הצעות לשיפור הביטוי

### 🗣️ דיבור (בפיתוח)
- **תרגולי שיחה** - עם בוט AI מתקדם
- **הקלטה וניתוח** - משוב על הגייה ושטף
- **תרחישים יומיומיים** - מצבי חיים אמיתיים

## 🚀 התקנה והפעלה

### ✅ דרישות מערכת
```bash
Node.js 18+ (Frontend)
Python 3.8+ (Backend)
Supabase Account (Database & Auth)
OpenAI API Key (AI Features)
```

### 🔧 הגדרת משתני סביבה
צור קובץ `.env` בשורש הפרויקט:
```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration  
VITE_OPENAI_API_KEY=sk-proj-your_openai_api_key

# Backend Configuration
VITE_BACKEND_URL=https://your-ngrok-url.ngrok-free.app

# External APIs
VITE_DIALOGUE_API_URL=https://your-ngrok-url.ngrok-free.app
```

### 🎨 הפעלת Frontend
```bash
# התקנת תלויות
npm install

# הפעלת שרת פיתוח
npm run dev

# בניית פרודקשן
npm run build

# תצוגה מקדימה של בניה
npm run preview
```

### 🐍 הפעלת Backend
```bash
# מעבר לתיקיית Backend
cd backend

# יצירת סביבה וירטואלית
python -m venv venv

# הפעלת הסביבה (macOS/Linux)
source venv/bin/activate

# הפעלת הסביבה (Windows)
venv\Scripts\activate

# התקנת תלויות
pip install -r requirements.txt

# הפעלת השרת
python app.py
```

### 🗄️ הגדרת מסד הנתונים
```bash
# התחברות ל-Supabase CLI
npx supabase login

# קישור הפרויקט
npx supabase link --project-ref your_project_ref

# הפעלת migrations
npx supabase db push

# בדיקת סטטוס
npx supabase migration list
```

## 📊 מטריקות וביצועים

### 🎯 מדדי הצלחה
- **שיעור השלמת תרגילים** - אחוז המשתמשים המסיימים תרגילים
- **זמן מעורבות יומי** - ממוצע זמן למידה ליום
- **שיפור ציונים** - מגמת התקדמות לאורך זמן
- **רמת שביעות רצון** - משוב משתמשים

### ⚡ אופטימיזציות ביצועים
- **Code Splitting** - טעינה מהירה של קומפוננטים
- **Lazy Loading** - טעינת תמונות ותוכן לפי דרישה
- **Database Indexes** - שאילתות מהירות
- **Caching Strategy** - זיכרון מטמון חכם

## 🔒 אבטחה ופרטיות

### 🛡️ אמצעי אבטחה
- **Row Level Security** - הגנה על רמת השורות בDB
- **JWT Authentication** - אימות מאובטח עם טוקנים
- **HTTPS Encryption** - הצפנת כל התקשורת
- **Input Validation** - אימות כל הקלטים

### 🔐 הגנת פרטיות
- **GDPR Compliant** - עמידה בתקנות אירופיות
- **Data Minimization** - איסוף מינימום של נתונים
- **User Control** - שליטה מלאה במידע האישי
- **Secure Storage** - אחסון מוצפן במסד הנתונים

## 🚀 פריסה לפרודקשן

### 🌐 Frontend Deployment
```bash
# Vercel (מומלץ)
npm install -g vercel
vercel --prod

# Netlify
npm run build
# העלה את תיקיית dist/
```

### ⚙️ Backend Deployment
```bash
# Railway
railway login
railway deploy

# Heroku
heroku create your-app-name
git push heroku main
```

### 📊 ניטור ובקרת איכות
- **Error Tracking** - Sentry לעקיבת שגיאות
- **Performance Monitoring** - מדידת זמני טעינה
- **User Analytics** - Google Analytics למעקב שימוש
- **Health Checks** - בדיקות תקינות אוטומטיות

## 🤝 תרומה לפרויקט

### 📋 הנחיות תרומה
1. **Fork** את הרפוזיטורי
2. **צור ענף חדש** לפיצ'ר שלך
3. **כתוב טסטים** לקוד החדש
4. **בדוק** שהכל עובד
5. **שלח Pull Request** עם תיאור מפורט

### 🎯 תחומים לתרומה
- **תרגילים חדשים** - סוגי תרגילים נוספים
- **שיפורי UI/UX** - עיצוב וחוויית משתמש
- **אופטימיזציות** - ביצועים ואבטחה
- **תיעוד** - הוספת הסברים ודוגמאות

## 📞 תמיכה וקהילה

### 💬 ערוצי תמיכה
- **GitHub Issues** - דיווח באגים ובקשות פיצ'רים
- **Discussions** - שאלות ודיונים קהילתיים
- **Email Support** - תמיכה ישירה לבעיות דחופות

### 📚 משאבים נוספים
- **API Documentation** - תיעוד מפורט של כל ה-APIs
- **Video Tutorials** - הדרכות וידאו שלב אחר שלב
- **Best Practices** - המלצות לפיתוח ושימוש

## 📄 רישיון

הפרויקט מופץ תחת רישיון MIT License - ראה קובץ [LICENSE](LICENSE) לפרטים מלאים.

---

<div align="center">

**🎓 נבנה בישראל עם ❤️ ללומדי צרפתית בכל העולם**

[![GitHub Stars](https://img.shields.io/github/stars/username/french-learning-platform?style=social)](https://github.com/username/french-learning-platform)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

</div>

## 🎯 יצירת תרגילים דינמיים

### תהליך יצירת תרגיל אישי
כאשר המשתמש לוחץ על "צור תרגיל", המערכת מבצעת ניתוח מתקדם:

1. **ניתוח פרופיל המשתמש**
   ```json
   {
     "user_id": "xyz",
     "level": "A2", 
     "preferred_skills": ["listening", "grammar"],
     "previous_attempts": [...]
   }
   ```

2. **החלטה אוטומטית של ה-AI**
   - זיהוי נושא רלוונטי לחיזוק
   - מיומנות חלשה יחסית לשיפור
   - רמת קושי מותאמת אישית
   - יצירת תרגיל דינמי מ-OpenAI

3. **מסך יצירה אינטואיטיבי**
   ```tsx
   // כפתור בסיסי
   <Button onClick={handleCreateExercise} 
           className="text-xl px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl shadow-lg">
     ✏️ צור תרגיל חדש
   </Button>
   
   // אפשרויות מתקדמות
   <Dialog>
     <DialogTrigger>אפשרויות מתקדמות</DialogTrigger>
     <DialogContent>
       <Select level />  
       <Checkboxes for skills />  
       <Slider for difficulty />  
       <Button>צור</Button>
     </DialogContent>
   </Dialog>
   ```

### שמירת היסטוריה מפורטת
```sql
exercise_attempts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  skill TEXT,         -- 'reading' / 'writing' / 'listening'
  level TEXT,         -- 'A1' / 'A2' / 'B1'
  score INTEGER,      -- 0–100
  feedback TEXT,      -- תיקונים והמלצות
  exercise_data JSONB, -- תוכן התרגיל המלא
  time_spent INTEGER, -- זמן בשניות
  created_at TIMESTAMP DEFAULT now()
)
```

דוגמה לרשומה:
```json
{
  "skill": "listening",
  "level": "A2", 
  "score": 85,
  "feedback": "טעית בזמנים של passé composé",
  "exercise_data": {
    "type": "audio_comprehension",
    "questions": [...],
    "correct_answers": [...]
  },
  "time_spent": 180,
  "created_at": "2025-07-28T16:10:00Z"
}
```

### 🎯 כלי לימוד נוספים
- **אתגר יומי**: תרגיל מיוחד כל יום
- **כרטיסי זיכרון**: לחזרה על מילים ומושגים
- **מעקב רצף**: עידוד למידה יומית
- **ניהול רמות**: מעבר חלק בין רמות שונות

## 🏗️ אדריכלות המערכת

### Frontend (React + TypeScript)
```
src/
├── components/          # קומפוננטים נפרדים
├── pages/              # דפי האפליקציה
├── hooks/              # React Hooks מותאמים
├── services/           # שירותי API
├── types/              # הגדרות TypeScript
├── config/             # קונפיגורציה
└── data/               # מידע סטטי
```

### Backend (Python Flask)
```
backend/
├── app.py              # שרת ראשי
├── services/           # שירותי ה-AI
│   ├── dialogue.py     # יצירת דיאלוגים
│   ├── audio.py        # סינתזת אודיו
│   ├── exercise_generator.py
│   ├── performance_analyzer.py
│   └── exercise_saver.py
└── static/             # קבצים סטטיים
```

### מסד נתונים (Supabase)
```sql
users              -- פרופילי משתמשים
exercise_attempts  -- תוצאות תרגילים  
user_progress      -- מעקב התקדמות
vocabulary_data    -- מילים וביטויים
```

## 🚀 התקנה והפעלה

### דרישות מוקדמות
- Node.js 18+ 
- Python 3.9+
- חשבון Supabase
- מפתח OpenAI API

### 1. הכנת הסביבה

```bash
# שיבוט הפרויקט
git clone <repository-url>
cd project-11

# התקנת תלויות Frontend
npm install

# התקנת תלויות Backend
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# או
venv\Scripts\activate     # Windows
pip install -r requirements.txt
```

### 2. הגדרת משתני סביבה

צור קובץ `.env` בספריית הבסיס:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration  
VITE_OPENAI_API_KEY=your_openai_api_key

# Backend Configuration
VITE_BACKEND_URL=http://localhost:5051
```

צור קובץ `.env` בספריית `backend`:
```env
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

### 3. הגדרת מסד הנתונים

```bash
# הפעלת המיגרציות
cd supabase
supabase db reset
```

### 4. הפעלת המערכת

טרמינל 1 - Frontend:
```bash
npm run dev
# http://localhost:5173
```

טרמינל 2 - Backend:
```bash
cd backend
python app.py
# http://localhost:5051
```

## 🔧 API Documentation

### Frontend API
| Endpoint | Method | תיאור |
|----------|--------|-------|
| `/api/generate-exercise` | POST | יצירת תרגיל דינמי |
| `/api/create-dialogue` | POST | יצירת דיאלוג AI |
| `/api/analyze-performance` | POST | ניתוח ביצועים |
| `/api/save-exercise-attempt` | POST | שמירת תוצאות |
| `/api/health` | GET | בדיקת תקינות |

### Supabase Tables
```sql
-- משתמשים
users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  name TEXT,
  current_level TEXT,
  total_points INTEGER,
  streak_days INTEGER,
  created_at TIMESTAMP,
  last_activity TIMESTAMP
)

-- נסיונות תרגילים  
exercise_attempts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  exercise_type TEXT,
  level TEXT,
  score INTEGER,
  time_spent INTEGER,
  created_at TIMESTAMP
)
```

## 🎨 עיצוב וחוויית משתמש

### עברית RTL
- מלא תמיכה בכתיבה מימין לשמאל
- ממשק בעברית עם אלמנטים באנגלית/צרפתית
- טייפוגרפיה מותאמת לעברית

### רספונסיבי
- תואם לכל מכשירים (Mobile, Tablet, Desktop)
- Grid system מתקדם עם Tailwind CSS
- אנימציות חלקות ואינטראקטיביות

### נגישות
- תמיכה במקלדת ובקורא מסך
- ניגודיות מותאמת  
- הודעות שגיאה ברורות

## 🔐 אבטחה

- **אימות Supabase**: Row Level Security (RLS)
- **הצפנת מידע**: כל התקשורת מוצפנת
- **אימות API**: מפתחות מוגנים
- **ולידציה**: בדיקת קלט בצד לקוח ושרת

## 📊 מעקב וניתוח

### Analytics מובנה
- זמן לימוד יומי/שבועי/חודשי
- ציונים ממוצעים לכל כישור
- מעקב רצף לימוד
- זיהוי נקודות חוזק וחולשה

### Performance Monitoring
- זמני טעינה
- שיעורי הצלחה בתרגילים
- שימוש בתכונות שונות
- שביעות רצון משתמשים

## 🚢 Production Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# העלאה לשירות hosting
```

### Backend (Railway/Heroku)
```bash
# הכנה לפרודקשן
pip freeze > requirements.txt
# העלאה לשירות cloud
```

### Environment Variables
וודא הגדרת כל משתני הסביבה בסביבת הפרודקשן.

## 🤝 תרומה לפרויקט

1. Fork הפרויקט
2. צור branch חדש (`git checkout -b feature/amazing-feature`)
3. Commit השינויים (`git commit -m 'Add amazing feature'`)
4. Push לbranch (`git push origin feature/amazing-feature`)
5. פתח Pull Request

## 📝 רישיון

המערכת מוגנה תחת רישיון MIT. ראה `LICENSE` לפרטים נוספים.

## 📧 יצירת קשר

**מפתח**: אור יוספי
**אימייל**: oryosefi2@gmail.com

---

## 🔍 פתרון בעיות נפוצות

### בעיית התחברות
```bash
# בדיקת חיבור Supabase
curl -X GET "your_supabase_url/rest/v1/" -H "apikey: your_anon_key"
```

### בעיית Backend
```bash
# בדיקת שרת Python
curl http://localhost:5051/api/health
```

### בעיית Frontend  
```bash
# ניקוי cache
npm run build
rm -rf node_modules package-lock.json
npm install
```

---

🇫🇷 **Bonne chance avec votre apprentissage du français!** 🇫🇷
