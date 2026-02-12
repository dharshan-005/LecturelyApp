from vosk import Model, KaldiRecognizer
import wave
import json
import os

MODEL_PATH = "models/vosk-model-en-us-0.22"
AUDIO_PATH = "sample3.wav"

# Sanity checks
if not os.path.exists(MODEL_PATH):
    raise Exception("Model path not found")

if not os.path.exists(AUDIO_PATH):
    raise Exception("Audio file not found")

wf = wave.open(AUDIO_PATH, "rb")

# VOSK requires mono 16kHz WAV
if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getframerate() != 16000:
    raise Exception("Audio must be WAV mono PCM 16kHz")

model = Model(MODEL_PATH)
rec = KaldiRecognizer(model, wf.getframerate())

results = []

while True:
    data = wf.readframes(4000)
    if len(data) == 0:
        break
    if rec.AcceptWaveform(data):
        part = json.loads(rec.Result())
        results.append(part.get("text", ""))

final = json.loads(rec.FinalResult())
results.append(final.get("text", ""))

print("Transcription:")
print(" ".join(results))