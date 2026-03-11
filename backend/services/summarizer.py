from fastapi import FastAPI, UploadFile
import pdfplumber
import docx

app = FastAPI()

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
