import os
from dotenv import load_dotenv
import openai

load_dotenv()

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def generate_dialogue(words, topic):
    prompt = f"""
    כתוב דיאלוג טבעי וזורם בצרפתית בנושא "{topic}" בין שני דוברים, באורך של כ-5 דקות דיבור (כ-30-40 שורות).

    אל תכתוב שמות או תיאורים לפני השורות.
    כתוב כל שורה של דובר חדשה בשורה נפרדת, כך שכל השיחה תיראה כמו דיאלוג אמיתי וטבעי בלבד.

    השתמש במילים הבאות בדיאלוג בצורה טבעית, מבלי להציג רשימות או משפטים מלאים במילים בלבד: {', '.join(words)}.

    השיחה צריכה להישמע יומיומית, טבעית ונעימה להאזנה, כאילו זו שיחה אמיתית בין שני אנשים בפודקאסט.

    דוגמה קצרה:
    – Bonjour! Tu veux aller au restaurant ce soir?
    – Oui, pourquoi pas. Tu as une idée d’endroit?
    """

    print("📤 שולח פרומפט ל-OpenAI:\n", prompt)

    try:
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "אתה כותב שיחות בצרפתית ללימוד"},
                {"role": "user", "content": prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        print("❌ שגיאה בקריאה ל-OpenAI:\n", e)
        return "שגיאה ביצירת דיאלוג."
