from gtts import gTTS
import json
import os

# Load questions with both English and Hindi
with open("questions.json", encoding="utf-8") as f:
    questions = json.load(f)

# Create folder if not exist
os.makedirs("audio_questions", exist_ok=True)

# Generate audio for both English and Hindi
for q in questions:
    # English audio
    tts_en = gTTS(q["text_en"], lang="en")
    tts_en.save(f"audio_questions/q{q['id']}_en.mp3")

    # Hindi audio
    tts_hi = gTTS(q["text_hi"], lang="hi")
    tts_hi.save(f"audio_questions/q{q['id']}_hi.mp3")

print("✅ Audio files generated successfully in 'audio_questions/'")
