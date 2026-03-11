import subprocess
import uuid
import os

async def extract_audio(video_path: str):
    os.makedirs("temp", exist_ok=True)

    audio_path = f"temp/{uuid.uuid4()}.wav"

    result = subprocess.run(
        [
            "ffmpeg",
            "-i", video_path,
            "-ar", "16000",
            "-ac", "1",
            "-c:a", "pcm_s16le",
            audio_path
        ],
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        print(result.stderr)
        raise Exception("Audio extraction failed")

    return audio_path