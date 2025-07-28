import os
import uuid
from gradio_client import Client
from pydub import AudioSegment  # pip install pydub

client = Client("antoniomae/EDGE-FRA-VOZ-TEXTO-BOA")

# Use any of these: ['Vivienne', 'Denise', 'Eloise', 'Remy', 'Henri']
VOICE_A = os.getenv("HF_VOICE_A", "Vivienne")
VOICE_B = os.getenv("HF_VOICE_B", "Henri")

def generate_audio(dialogue):
    lines = dialogue.strip().split('\n')
    audio_chunks = []

    for i, line in enumerate(lines):
        voice = VOICE_A if i % 2 == 0 else VOICE_B
        print(f"Generating audio for: {line} with voice: {voice}")

        # מחזיר נתיב מקומי של הקובץ
        audio_path = client.predict(
            text=line.strip(),
            voices=voice,
            rate=0,
            volume=0,
            api_name="/textToSpeech"
        )

        # טען את הקובץ ישירות מהנתיב המקומי
        audio_segment = AudioSegment.from_file(audio_path, format="mp3")
        audio_chunks.append(audio_segment)

    # איחוד כל חלקי האודיו
    final_audio = sum(audio_chunks)

    filename = f"dialogue_{uuid.uuid4().hex}.mp3"
    output_path = os.path.join("static/audio", filename)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # שמירת האודיו המאוחד בקובץ mp3
    final_audio.export(output_path, format="mp3")

    return f"/api/audio/{filename}"
