from typing import List, Dict, Any
import json
from datetime import datetime

def save_exercise_attempt(attempt_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    שמירת תוצאות תרגיל (כרגע רק לוג, בעתיד יתחבר למסד נתונים)
    """
    
    print("💾 שומר תוצאות תרגיל:")
    print(f"   משתמש: {attempt_data.get('user_id')}")
    print(f"   תרגיל: {attempt_data.get('exercise_id')}")
    print(f"   מיומנות: {attempt_data.get('skill_category')}")
    print(f"   תשובות: {attempt_data.get('user_answers')}")
    print(f"   זמן: {attempt_data.get('time_spent')} שניות")
    
    # חישוב ציון
    user_answers = attempt_data.get('user_answers', [])
    correct_answers = attempt_data.get('correct_answers', [])
    
    if len(user_answers) == len(correct_answers):
        correct_count = sum(1 for i, answer in enumerate(user_answers) 
                          if i < len(correct_answers) and answer == correct_answers[i])
        score = (correct_count / len(correct_answers)) * 100 if correct_answers else 0
    else:
        score = 0
    
    # ניתוח טעויות בסיסי
    error_analysis = analyze_errors(user_answers, correct_answers)
    
    # יצירת הצעות שיפור
    improvement_suggestions = generate_suggestions(error_analysis, attempt_data.get('skill_category'))
    
    result = {
        "attempt_id": f"attempt_{datetime.now().strftime('%Y%m%d_%H%M%S')}",
        "score": round(score, 2),
        "is_correct": score == 100,
        "error_analysis": error_analysis,
        "improvement_suggestions": improvement_suggestions,
        "saved_at": datetime.now().isoformat()
    }
    
    print(f"✅ תוצאות נשמרו: ציון {score:.0f}%")
    
    # כאן בעתיד נשמור למסד נתונים אמיתי
    # לעת עתה רק מחזירים את התוצאות
    
    return result


def analyze_errors(user_answers: list, correct_answers: list) -> Dict[str, Any]:
    """
    ניתוח טעויות בתשובות
    """
    
    if not user_answers or not correct_answers:
        return {"error_types": [], "specific_errors": []}
    
    error_types = []
    specific_errors = []
    
    for i, (user_answer, correct_answer) in enumerate(zip(user_answers, correct_answers)):
        if user_answer != correct_answer:
            error_type = classify_error(user_answer, correct_answer)
            error_types.append(error_type)
            
            specific_errors.append({
                "question_index": i,
                "user_answer": user_answer,
                "correct_answer": correct_answer,
                "error_type": error_type
            })
    
    # ספירת סוגי טעויות
    error_counts = {}
    for error_type in error_types:
        error_counts[error_type] = error_counts.get(error_type, 0) + 1
    
    return {
        "error_types": list(error_counts.keys()),
        "error_counts": error_counts,
        "specific_errors": specific_errors,
        "total_errors": len(specific_errors)
    }


def classify_error(user_answer: Any, correct_answer: Any) -> str:
    """
    סיווג סוג הטעות
    """
    
    if isinstance(user_answer, str) and isinstance(correct_answer, str):
        if user_answer.lower() == correct_answer.lower():
            return "capitalization"
        elif len(user_answer) != len(correct_answer):
            return "content"
        else:
            return "spelling"
    elif isinstance(user_answer, bool) and isinstance(correct_answer, bool):
        return "comprehension"
    elif isinstance(user_answer, int) and isinstance(correct_answer, int):
        return "multiple_choice"
    else:
        return "content"


def generate_suggestions(error_analysis: Dict[str, Any], skill_category: str) -> List[str]:
    """
    יצירת הצעות שיפור לפי ניתוח הטעויות
    """
    
    suggestions = []
    error_counts = error_analysis.get("error_counts", {})
    
    # הצעות לפי סוגי טעויות
    if "grammar" in error_counts and error_counts["grammar"] > 2:
        suggestions.append("תרגל עוד דקדוק בסיסי - זמן הווה ותווי קביעה")
    
    if "spelling" in error_counts and error_counts["spelling"] > 1:
        suggestions.append("שים לב לכתיב המילים - תרגל כתיבה איטית יותר")
    
    if "vocabulary" in error_counts:
        suggestions.append("הרחב את אוצר המילים בנושא זה")
    
    if "comprehension" in error_counts and error_counts["comprehension"] > 1:
        suggestions.append("קרא את הטקסט שוב לפני מענה על השאלות")
    
    # הצעות כלליות לפי מיומנות
    if skill_category == "comprehension_ecrite":
        suggestions.append("תרגל קריאה יומית של טקסטים קצרים")
    elif skill_category == "production_ecrite":
        suggestions.append("תרגל כתיבה של משפטים פשוטים")
    
    return suggestions[:3]  # מגביל ל-3 הצעות