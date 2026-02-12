from vosk import Model, KaldiRecognizer
import wave
import json
import requests
import sys

AUDIO_PATH = sys.argv[1] if len(sys.argv) > 1 else "sample2.wav"

print("Processing audio file:", AUDIO_PATH)

MODEL_PATH = "models/vosk-model-en-us-0.22"
# AUDIO_PATH = "sample3.wav"
TARGET_LANG = "ta"

TECH_GLOSSARY = {
    "react": "__TECH_REACT__",
    "javascript": "__TECH_JAVASCRIPT__"
}

def protect_terms(text):
    for k, v in TECH_GLOSSARY.items():
        text = text.replace(k, v)
    return text

def restore_terms(text):
    for k, v in TECH_GLOSSARY.items():
        text = text.replace(v, k.capitalize())
    return text

def translate_text(text):
    url = "https://api.mymemory.translated.net/get"
    params = {"q": text, "langpair": f"en|{TARGET_LANG}"}
    res = requests.get(url, params=params).json()
    return res["responseData"]["translatedText"]

def format_time(seconds):
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    ms = int((seconds - int(seconds)) * 1000)
    return f"{hrs:02}:{mins:02}:{secs:02},{ms:03}"

wf = wave.open(AUDIO_PATH, "rb")
model = Model(MODEL_PATH)
rec = KaldiRecognizer(model, wf.getframerate())
rec.SetWords(True)

segments = []

while True:
    data = wf.readframes(4000)
    if len(data) == 0:
        break
    if rec.AcceptWaveform(data):
        result = json.loads(rec.Result())
        if "result" in result:
            segments.append(result)

final = json.loads(rec.FinalResult())
if "result" in final:
    segments.append(final)

# ---- BUILD SRT ----
srt_lines = []
index = 1

for seg in segments:
    words = seg.get("result", [])
    if not words:
        continue

    start = words[0]["start"]
    end = words[-1]["end"]
    sentence = " ".join(w["word"] for w in words)

    protected = protect_terms(sentence)
    translated = translate_text(protected)
    final_text = restore_terms(translated)

    srt_lines.append(f"{index}")
    srt_lines.append(f"{format_time(start)} --> {format_time(end)}")
    srt_lines.append(final_text)
    srt_lines.append("")

    index += 1

with open("output1.srt", "w", encoding="utf-8") as f:
    f.write("\n".join(srt_lines))

print("SRT file generated: output1.srt")