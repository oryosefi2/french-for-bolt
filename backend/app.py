from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from services.dialogue import generate_dialogue
from services.audio import generate_audio
from services.exercise_generator import generate_exercise
from services.performance_analyzer import analyze_user_performance
from services.exercise_saver import save_exercise_attempt

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


@app.route('/api/generate-exercise', methods=['POST'])
def create_exercise():
    print("📚 קיבלתי בקשה ליצירת תרגיל דינמי")
    
    data = request.json
    print("📊 נתוני התרגיל:", data)
    
    level = data.get('level', 'A1')
    skill_category = data.get('skill_category', 'comprehension_ecrite')
    topic = data.get('topic', 'général')
    difficulty = data.get('difficulty', 3)
    template_type = data.get('template_type', 'reading_comprehension')
    prompt = data.get('prompt', '')
    
    try:
        exercise_content = generate_exercise(
            level=level,
            skill_category=skill_category,
            topic=topic,
            difficulty=difficulty,
            template_type=template_type,
            custom_prompt=prompt
        )
        
        print("✅ תרגיל נוצר בהצלחה")
        return jsonify({
            "success": True,
            "content": exercise_content["content"],
            "correct_answers": exercise_content["correct_answers"],
            "explanation": exercise_content.get("explanation"),
            "usage": exercise_content.get("usage", {})
        })
        
    except Exception as e:
        print(f"❌ שגיאה ביצירת תרגיל: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/analyze-performance', methods=['POST'])
def analyze_performance():
    print("📈 קיבלתי בקשה לניתוח ביצועים")
    
    data = request.json
    user_id = data.get('user_id')
    skill_category = data.get('skill_category')
    level = data.get('level')
    
    try:
        analysis = analyze_user_performance(user_id, skill_category, level)
        
        return jsonify({
            "success": True,
            "analytics": analysis
        })
        
    except Exception as e:
        print(f"❌ שגיאה בניתוח ביצועים: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/save-exercise-attempt', methods=['POST'])
def save_attempt():
    print("💾 קיבלתי בקשה לשמירת תוצאות תרגיל")
    
    data = request.json
    
    try:
        result = save_exercise_attempt(data)
        
        return jsonify({
            "success": True,
            "result": result
        })
        
    except Exception as e:
        print(f"❌ שגיאה בשמירת תוצאות: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route('/api/create-dialogue', methods=['POST'])
def create_dialogue():
    print("📥 קיבלתי בקשה ליצירת דיאלוג")

    data = request.json
    print("🔤 מילים:", data.get('words'))
    print("🎯 נושא:", data.get('topic'))

    words = data.get('words', [])
    topic = data.get('topic', 'שיחה כללית')

    dialogue = generate_dialogue(words, topic)
    print("📝 דיאלוג שנוצר:", dialogue)

    audio_url = generate_audio(dialogue)
    #audio_url = None
    print("🔊 אודיו:", audio_url)

    return jsonify({
        "success": True,
        "dialogue": dialogue,
        "audioUrl": audio_url
    })



@app.route("/api/audio/<filename>")
def get_audio(filename):
    return send_from_directory("static/audio", filename)



@app.route("/api/health", methods=["GET", "OPTIONS"])
def health():
    return jsonify({"status": "healthy", "message": "Server is running"})

if __name__ == '__main__':
    app.run(debug=True, port=5050)
