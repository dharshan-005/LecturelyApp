from fastapi import APIRouter, BackgroundTasks
from services.downloader import download_video
from services.audio_extractor import extract_audio
from services.transcriber import generate_subtitles
from services.translator import translate_subtitles
from services.cleanup import delete_file
from pydantic import BaseModel

import os

router = APIRouter()

class RequestBody(BaseModel):
    url: str
    target_lang: str


@router.post("/generate-from-url")
async def generate_from_url(body: RequestBody, background_tasks: BackgroundTasks):
    url= body.url
    target_lang= body.target_lang

    print("🔥 PYTHON HIT")
    print("URL:", url)

    # 1️⃣ Download video
    video_path = await download_video(url)
    
    print("Url received:", url)
    print("Downloaded file:", video_path)

    # 2️⃣ Extract audio (VERY IMPORTANT)
    audio_path = await extract_audio(video_path)

    # 3️⃣ Run whisper on audio, not video
    subtitles = await generate_subtitles(audio_path)

    # 4️⃣ Translate
    translated = await translate_subtitles(subtitles, target_lang)

    # 5️⃣ Cleanup
    background_tasks.add_task(delete_file, video_path)
    background_tasks.add_task(delete_file, audio_path)
    
    def srt_to_seconds(time_str: str) -> float:
        hms, ms = time_str.split(",")
        h, m, s = map(int, hms.split(":"))
        return h * 3600 + m * 60 + s + int(ms) / 1000
    
    if translated:
        print("Translated sample:", translated[0])

    merged = []

    for index, (orig, trans) in enumerate(zip(subtitles, translated)):
        
        start_str = orig["timestamps"]["from"]
        end_str = orig["timestamps"]["to"]
        
        merged.append({
            "id": index,
            "start": srt_to_seconds(start_str),   # must already be numeric seconds
            "end": srt_to_seconds(end_str),
            "original": orig["text"],
            "translated": trans["text"]
        })

    return {
        "video": f"/temp/{os.path.basename(video_path)}",
        "subtitles": merged
    }
    # return {
    #     "video": os.path.basename(video_path),
    #     "subtitles": merged
    # }
    
    # return {
    #     "original": subtitles,
    #     "translated": translated
    # }