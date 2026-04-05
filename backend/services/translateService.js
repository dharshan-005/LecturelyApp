import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// retry logic
async function callGemini(prompt) {
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return response.text;
    } catch (err) {
      if (err.status === 503 && i < maxRetries - 1) {
        console.log("Gemini overloaded, retrying...");
        await new Promise((res) => setTimeout(res, 3000));
      } else {
        throw err;
      }
    }
  }
}

export const translateText = async (subtitles, targetLang = "ta") => {
  try {
    console.log("🌍 TRANSLATION STARTED");

    const textArray = subtitles.map((s) => s.text);

    const prompt = `
Translate naturally, not word-by-word.
Make it sound fluent and native in ${targetLang}.

Return ONLY a JSON array of translated sentences in the SAME order.

Sentences:
${JSON.stringify(textArray)}
`;

    const result = await callGemini(prompt);

    console.log("🧠 GEMINI TRANSLATION RAW:", result);

    // clean response
    let cleaned = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let translatedArray;

    try {
      translatedArray = JSON.parse(cleaned);
    } catch (err) {
      console.log("⚠️ Translation parse failed");
      return subtitles; // fallback
    }

    // map back to subtitle structure
    const translatedSubtitles = subtitles.map((sub, i) => ({
      id: sub.id,
      start: sub.start,
      end: sub.end,
      text: translatedArray[i] || sub.text,
    }));

    console.log("✅ TRANSLATION COMPLETE");

    return translatedSubtitles;
  } catch (error) {
    console.error("❌ Translation Error:", error);
    return subtitles;
  }
};
