# FrenchAI - מערכת לימוד צרפתית מתקדמת 🇫🇷

מערכת לימוד צרפתית אינטראקטיבית המותאמת אישית לכל לומד, עם שילוב של בינה מלאכותית, יצירת תרגילים דינמיים ומעקב אחר התקדמות.

## 🌟 תכונות עיקריות

### 📚 לימוד מותאם אישית
- **6 כישורי לימוד**: קריאה, האזנה, כתיבה, דיבור, אוצר מילים ודקדוק
- **רמות CEFR**: A1, A2, B1, B2, C1, C2
- **תרגילים דינמיים**: נוצרים בזמן אמת באמצעות AI
- **מעקב התקדמות**: ניתוח מפורט של ביצועים וחוזקות

### 🤖 בינה מלאכותית מתקדמת
- **יצירת תרגילים**: תרגילים מותאמים לרמה ולנושא
- **דיאלוגים חיים**: שיחות עם בינה מלאכותית
- **סינתזת דיבור**: המרת טקסט לאודיו איכותי
- **ניתוח ביצועים**: המלצות מותאמות אישית

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
