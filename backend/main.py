from fastapi import FastAPI, UploadFile
import pdfplumber
import docx
from routes.subtitle import router as subtitle_router
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

import os

os.makedirs("temp", exist_ok=True)
os.makedirs("uploads", exist_ok=True)

app = FastAPI()
app.include_router(subtitle_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "running"}

app.mount("/temp", StaticFiles(directory="temp"), name="temp")

@app.post("/extract")
async def extract_text(file: UploadFile):
    content = ""

    if file.filename.endswith(".pdf"):
        with pdfplumber.open(file.file) as pdf:
            for page in pdf.pages:
                content += page.extract_text() or ""

    elif file.filename.endswith(".docx"):
        doc = docx.Document(file.file)
        for para in doc.paragraphs:
            content += para.text + "\n"

    else:
        return {"error": "Unsupported file type"}

    return {"extractedText": content}