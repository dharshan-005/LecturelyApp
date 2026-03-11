import requests

async def translate_subtitles(subtitles, target_lang):
    translated = []

    for segment in subtitles:
        text = segment["text"]

        response = requests.get(
            "https://api.mymemory.translated.net/get",
            params={
                "q": text,
                "langpair": f"en|{target_lang}"
            }
        )

        data = response.json()

        # Debug print
        print("TRANSLATION API RESPONSE:", data)

        translated_text = (
            data.get("responseData", {}).get("translatedText")
        )
        
        print("Target lang received:", target_lang)

        # Fallback if API fails
        if not translated_text:
            translated_text = ""

        translated.append({
            "start": segment["timestamps"]["from"],
            "end": segment["timestamps"]["to"],
            "text": translated_text
        })

    return translated