import os
import uuid
import requests
from dotenv import load_dotenv
load_dotenv()

VOICE_A = os.getenv("VOICE_ID_A")  # לדובר הראשון
VOICE_B = os.getenv("VOICE_ID_B")  # לדובר השני

def generate_audio(dialogue):
    lines = dialogue.strip().split('\n')
    audio_chunks = []

    for i, line in enumerate(lines):
        voice_id = VOICE_A if i % 2 == 0 else VOICE_B
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"

        headers = {
            "xi-api-key": os.getenv("ELEVENLABS_API_KEY"),
            "Content-Type": "application/json"
        }

        payload = {
            "text": line.strip(),
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.75}
        }

        response = requests.post(url, headers=headers, json=payload)
        if response.status_code != 200:
            raise Exception(f"Audio generation failed: {response.text}")

        audio_chunks.append(response.content)

    # שמירה של האודיו המאוחד
    filename = f"dialogue_{uuid.uuid4().hex}.mp3"
    output_path = os.path.join("static/audio", filename)
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # איחוד הקטעים
    with open(output_path, "wb") as f:
        for chunk in audio_chunks:
            f.write(chunk)

    return f"/api/audio/{filename}"
