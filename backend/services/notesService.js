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

export const generateNotes = async (refinedText) => {
  try {
    console.log("📝 NOTES GENERATION STARTED");

    const prompt = `
Analyze the following lecture content and generate structured study notes.

Return ONLY valid JSON in this format:
{
  "summary": "short paragraph summary",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "importantConcepts": ["concept 1", "concept 2"]
}

Rules:
- Summary should be concise (3–4 lines)
- Key points should be clear and useful for revision
- Concepts should be important technical terms
- Do NOT include explanations outside JSON
- Output ONLY JSON

Lecture Content:
${refinedText}
`;

    // const result = await callGemini(prompt);
    let result;

    try {
      result = await callGemini(prompt);
    } catch (err) {
      if (err.status === 429) {
        console.warn("Quota exceeded — fallback context");

        return {
          summary: "Not available (quota exceeded)",
          keyPoints: [],
          importantConcepts: [],
        };
      }
      throw err;
    }

    console.log("🧠 GEMINI NOTES RAW:", result);

    // clean response
    let cleaned = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;

    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.log("⚠️ Notes parse failed");

      parsed = {
        summary: refinedText.slice(0, 200),
        keyPoints: [],
        importantConcepts: [],
      };
    }

    console.log("✅ FINAL NOTES:", parsed);

    return parsed;
  } catch (error) {
    console.error("❌ Notes Error:", error);

    return {
      summary: refinedText,
      keyPoints: [],
      importantConcepts: [],
    };
  }
};
