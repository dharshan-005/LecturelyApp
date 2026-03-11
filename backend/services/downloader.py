import subprocess
import uuid
import sys
import os

async def download_video(url: str):
    os.makedirs("temp", exist_ok=True)

    filename = f"temp/{uuid.uuid4()}.mp4"

    result = subprocess.run([
        sys.executable,
        "-m",
        "yt_dlp",
        "-f", "mp4",
        "-o", filename,
        url
    ], capture_output=True)

    if result.returncode != 0:
        raise Exception(result.stderr.decode())

    return filename