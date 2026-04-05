FROM python:3.10-slim

WORKDIR /app

# Install ffmpeg
RUN apt-get update && apt-get upgrade -y && apt-get install -y ffmpeg

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]