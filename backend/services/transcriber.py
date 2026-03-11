import subprocess
import json
import uuid
import os

WHISPER_BIN = "whisper.cpp/build/bin/Release/whisper-cli.exe"
MODEL_PATH = "whisper.cpp/models/ggml-small.bin"

async def generate_subtitles(audio_path: str):
    os.makedirs("temp", exist_ok=True)

    output_prefix = f"temp/{uuid.uuid4()}"

    process = subprocess.run(
        [
            WHISPER_BIN,
            "-m", MODEL_PATH,
            "-f", audio_path,
            "--output-json",
            "-of", output_prefix
        ],
        capture_output=True,
        text=True
    )

    # 🔍 Print actual whisper output
    print("STDOUT:\n", process.stdout)
    print("STDERR:\n", process.stderr)

    if process.returncode != 0:
        raise Exception("Whisper failed")

    json_path = output_prefix + ".json"

    if not os.path.exists(json_path):
        raise Exception("JSON output not created by whisper")

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    return data["transcription"]
# import subprocess
# import json
# from unittest import result
# import uuid
# import os

# WHISPER_BIN = "whisper.cpp/build/bin/Release/whisper-cli.exe"
# MODEL_PATH = "whisper.cpp/models/ggml-small.bin"

# async def generate_subtitles(audio_path: str):
#     output_prefix = f"temp/{uuid.uuid4()}"

#     subprocess.run([
#         WHISPER_BIN,
#         "-m", MODEL_PATH,
#         "-f", audio_path,
#         "--output-json",                 # output JSON
#         "-of", output_prefix   # output filename prefix
#     ],
#     capture_output=True,
#     text=True
#     )
    
#     print("Whisper output:", result.stdout)
#     print("Whisper error:", result.stderr)

#     json_path = output_prefix + ".json"

#     with open(json_path, "r") as f:
#         data = json.load(f)

#     return data["transcription"]