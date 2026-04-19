import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const processWithAI = async (transcript, targetLang = "ta") => {
  try {
    // ✅ LIMIT SIZE (VERY IMPORTANT)
    const limitedText = transcript.slice(0, 3000);

    const prompt = `
Analyze and process the following lecture transcript.

Return ONLY valid JSON in this format:
{
  "refined": "clean improved transcript",
  "translated": ["translated sentence1", "translated sentence2"],
  "notes": {
    "summary": "short summary",
    "keyPoints": ["point1", "point2"],
    "importantConcepts": ["concept1"]
  }
}

Rules:
- Improve clarity of transcript
- Translate naturally into ${targetLang}
- Keep same order for translation
- Output ONLY JSON

Transcript:
${limitedText}
`;

    // ✅ small delay (avoid rate spike)
    await new Promise((res) => setTimeout(res, 2000));

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let cleaned = response.text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.log("⚠️ JSON parse failed");

      parsed = {
        refined: transcript,
        translated: [],
        notes: {
          summary: transcript.slice(0, 200),
          keyPoints: [],
          importantConcepts: [],
        },
      };
    }

    return parsed;
  } catch (err) {
    console.error("AI Service Error:", err);

    return {
      refined: transcript,
      translated: [],
      notes: {
        summary: transcript.slice(0, 200),
        keyPoints: [],
        importantConcepts: [],
      },
    };
  }
};
