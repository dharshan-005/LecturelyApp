from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from services.summarizer import summarize_text

app = FastAPI(title="Lecturely AI Services")

# ✅ ADD THIS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SummaryRequest(BaseModel):
    text: str
    min_length: int = 30
    max_length: int = 130
    chunk_size: int = 400

class SummaryResponse(BaseModel):
    summary: str

@app.post("/api/summarize", response_model=SummaryResponse)
async def summarize(req: SummaryRequest):
    summary = summarize_text(
        req.text,
        req.min_length,
        req.max_length,
        req.chunk_size
    )
    return {"summary": summary}
