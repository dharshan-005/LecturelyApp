import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// 🔁 Retry wrapper (important for stability)
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

console.log("Refinement service loaded");
// 🧠 MAIN FUNCTION
export const refineTranscript = async (transcript, context) => {
  console.log("Refinement function called");
  try {
    console.log("🔹 RAW TRANSCRIPT:", transcript);

    const prompt = `
Rewrite the following transcript into a clear, well-structured lecture explanation.

Rules:
- Improve clarity significantly
- Rewrite sentences (not just fix grammar)
- Remove filler words (uh, um, etc.)
- Improve flow and readability
- Keep the original meaning
- Use proper punctuation

Context:
Topic: ${context?.topic || "general"}
Keywords: ${(context?.keywords || []).join(", ")}

Transcript:
${transcript}

Return ONLY the improved version.
`;

    const result = await callGemini(prompt);

    console.log("🧠 GEMINI RAW RESPONSE:", result);

    // 🧹 CLEAN RESPONSE
    let cleaned = result
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/^.*?:\s*/i, "") // removes "Here is..." etc
      .trim();

    console.log("✅ REFINED OUTPUT:", cleaned);

    // fallback safety
    if (!cleaned || cleaned.length < 20) {
      console.log("⚠️ Refinement fallback triggered");
      return transcript;
    }

    return cleaned;
  } catch (error) {
    console.error("❌ Refinement Error:", error);
    return transcript; // fallback
  }
};
