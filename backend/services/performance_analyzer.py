from typing import Dict, Any, List
import json

def analyze_user_performance(user_id: str, skill_category: str, level: str) -> Dict[str, Any]:
    """
    ניתוח ביצועי משתמש (כרגע מחזיר נתונים דמה)
    בעתיד יתחבר למסד נתונים אמיתי
    """
    
    print(f"📊 מנתח ביצועים עבור משתמש {user_id}")
    
    # נתונים דמה לבדיקה
    # בעתיד זה יבוא ממסד נתונים אמיתי
    mock_analytics = {
        "comprehension_ecrite": {
            "accuracy_rate": 0.75,
            "average_time_per_exercise": 180,  # 3 דקות
            "improvement_rate": 0.15,
            "consistency_score": 0.8,
            "common_errors": [
                {"type": "vocabulary", "count": 5},
                {"type": "grammar", "count": 3}
            ],
            "strong_areas": ["basic_vocabulary", "simple_sentences"],
            "weak_areas": ["complex_grammar", "long_texts"]
        },
        "production_ecrite": {
            "accuracy_rate": 0.65,
            "average_time_per_exercise": 300,  # 5 דקות
            "improvement_rate": 0.1,
            "consistency_score": 0.6,
            "common_errors": [
                {"type": "grammar", "count": 8},
                {"type": "spelling", "count": 4}
            ],
            "strong_areas": ["basic_vocabulary"],
            "weak_areas": ["verb_conjugation", "sentence_structure"]
        },
        "comprehension_orale": {
            "accuracy_rate": 0.7,
            "average_time_per_exercise": 240,
            "improvement_rate": 0.2,
            "consistency_score": 0.7,
            "common_errors": [
                {"type": "pronunciation", "count": 6},
                {"type": "speed", "count": 4}
            ],
            "strong_areas": ["basic_words"],
            "weak_areas": ["fast_speech", "accents"]
        },
        "production_orale": {
            "accuracy_rate": 0.6,
            "average_time_per_exercise": 120,
            "improvement_rate": 0.05,
            "consistency_score": 0.5,
            "common_errors": [
                {"type": "pronunciation", "count": 10},
                {"type": "fluency", "count": 7}
            ],
            "strong_areas": ["basic_phrases"],
            "weak_areas": ["pronunciation", "sentence_formation"]
        }
    }
    
    # החזרת analytics לפי המיומנות המבוקשת
    analytics = mock_analytics.get(skill_category, mock_analytics["comprehension_ecrite"])
    
    # התאמה לרמה
    if level == "A1":
        # רמה A1 - ביצועים נמוכים יותר זה נורמלי
        analytics["accuracy_rate"] = max(0.5, analytics["accuracy_rate"] - 0.1)
    elif level == "A2":
        # רמה A2 - ביצועים קצת יותר גבוהים
        analytics["accuracy_rate"] = min(0.9, analytics["accuracy_rate"] + 0.05)
    
    print(f"✅ ניתוח הושלם: דיוק {analytics['accuracy_rate']:.0%}")
    
    return analytics


def calculate_adaptive_difficulty(base_difficulty: int, analytics: Dict[str, Any]) -> int:
    """
    חישוב רמת קושי מותאמת לפי ביצועי המשתמש
    """
    
    accuracy = analytics.get("accuracy_rate", 0.7)
    consistency = analytics.get("consistency_score", 0.7)
    improvement = analytics.get("improvement_rate", 0.1)
    
    adjusted_difficulty = base_difficulty
    
    # התאמה לפי דיוק
    if accuracy < 0.6:
        adjusted_difficulty -= 1
    elif accuracy > 0.85:
        adjusted_difficulty += 1
    
    # התאמה לפי עקביות
    if consistency < 0.5:
        adjusted_difficulty -= 1
    
    # התאמה לפי קצב שיפור
    if improvement < 0:
        adjusted_difficulty -= 1
    elif improvement > 0.3:
        adjusted_difficulty += 1
    
    # וידוא שהקושי בטווח תקין
    return max(1, min(5, adjusted_difficulty))


def generate_improvement_suggestions(analytics: Dict[str, Any], skill_category: str) -> List[str]:
    """
    יצירת הצעות שיפור מותאמות אישית
    """
    
    suggestions = []
    accuracy = analytics.get("accuracy_rate", 0.7)
    weak_areas = analytics.get("weak_areas", [])
    common_errors = analytics.get("common_errors", [])
    
    # הצעות לפי דיוק
    if accuracy < 0.6:
        suggestions.append("מומלץ לחזור על החומר הבסיסי לפני מעבר לתרגילים מתקדמים")
        suggestions.append("תרגל תרגילים קלים יותר לחיזוק הביטחון")
    elif accuracy > 0.85:
        suggestions.append("אתה מצטיין! בוא ננסה תרגילים מאתגרים יותר")
        suggestions.append("מוכן לעבור לרמה הבאה")
    
    # הצעות לפי תחומי חולשה
    for area in weak_areas:
        if area == "complex_grammar":
            suggestions.append("תרגל עוד דקדוק - זמנים ותווי קביעה")
        elif area == "vocabulary":
            suggestions.append("הרחב את אוצר המילים בנושאים יומיומיים")
        elif area == "pronunciation":
            suggestions.append("תרגל הגייה עם הקראות איטיות")
    
    # הצעות לפי טעויות נפוצות
    for error in common_errors:
        if error["type"] == "grammar" and error["count"] > 5:
            suggestions.append("שים דגש מיוחד על תרגילי דקדוק")
        elif error["type"] == "spelling" and error["count"] > 3:
            suggestions.append("תרגל כתיבה איטית יותר ובדוק איות")
    
    return suggestions[:3]  # מגביל ל-3 הצעות