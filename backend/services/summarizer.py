import transformers

# Load once (global cache)
summarizer = transformers.pipeline(
    "summarization",
    model="sshleifer/distilbart-cnn-12-6",
    framework="pt"
)

def chunk_text(text, max_words=400):
    words = text.split()
    return [
        " ".join(words[i:i + max_words])
        for i in range(0, len(words), max_words)
    ]

def summarize_text(
    text: str,
    min_len: int = 30,
    max_len: int = 130,
    chunk_size: int = 400
) -> str:

    chunks = chunk_text(text, chunk_size)
    summaries = []

    for chunk in chunks:
        summary = summarizer(
            chunk,
            min_length=min_len,
            max_length=max_len,
            do_sample=False
        )[0]["summary_text"]

        summaries.append(summary)

    combined = " ".join(summaries)

    # second pass if needed
    if len(combined.split()) > max_len:
        combined = summarizer(
            combined,
            min_length=min_len,
            max_length=max_len,
            do_sample=False
        )[0]["summary_text"]

    return combined
