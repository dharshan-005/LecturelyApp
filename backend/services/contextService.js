import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 🔁 Retry logic
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
      if ((err.status === 503 || err.status === 429) && i < maxRetries - 1) {
        console.log("Gemini busy/quota hit, retrying...");

        // ⏳ wait longer for 429
        const delay = err.status === 429 ? 10000 : 3000;

        await new Promise((res) => setTimeout(res, delay));
      } else {
        throw err;
      }
    }
  }
}

// 🧠 MAIN FUNCTION
export const extractContext = async (transcript) => {
  try {
    console.log("📘 CONTEXT EXTRACTION STARTED");

    const prompt = `
Analyze the following lecture transcript and extract structured context.

Return ONLY valid JSON in this format:
{
  "topic": "main topic",
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
}

Rules:
- Topic should be concise (1 line)
- Keywords should be important technical terms
- Do NOT include explanations
- Output ONLY JSON

Transcript:
${transcript}
`;

    // const result = await callGemini(prompt);
    let result;

    try {
      result = await callGemini(prompt);
    } catch (err) {
      if (err.status === 429) {
        console.warn("Quota exceeded — fallback context");

        return {
          topic: "general",
          keywords: [],
        };
      }
      throw err;
    }
    
    console.log("🧠 GEMINI CONTEXT RAW:", result);

    // 🧹 CLEAN RESPONSE
    let cleaned = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.log("⚠️ JSON parse failed, using fallback");

      parsed = {
        topic: "general",
        keywords: [],
      };
    }

    console.log("✅ FINAL CONTEXT:", parsed);

    return parsed;
  } catch (error) {
    console.error("❌ Context Error:", error);

    return {
      topic: "unknown",
      keywords: [],
    };
  }
};
