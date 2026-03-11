import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

function getLanguageName(code: string) {
  const map: Record<string, string> = {
    ta: "Tamil",
    ja: "Japanese",
    hi: "Hindi",
    te: "Telugu",
    de: "German",
    en: "English",
  };

  return map[code] || "English";
}

function buildPrompt(
  text: string,
  language: string,
  length: string,
  format: string
) {
  const wordRange =
    length === "Short" ? "100-150 words" : "300-400 words";

  const formatInstruction =
    format === "bullet"
      ? `
FORMAT RULES:
- Use "-" at the start of each bullet
- Each bullet must be 1-2 sentences
- Do NOT number bullets
- Do NOT write paragraphs
`
      : `
FORMAT RULES:
- Write as one continuous paragraph
- Do NOT use bullet points
- Do NOT use numbering
`;

  return `
You are a strict summarization engine.

OUTPUT LANGUAGE: ${getLanguageName(language)}
SUMMARY LENGTH: ${wordRange}

${formatInstruction}

Return ONLY the summary text.

TEXT:
"""${text}"""
`;
}

async function callGemini(prompt: string) {
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      });

      return response.text ?? "";
    } catch (err: any) {

      if (err.status === 503 && i < maxRetries - 1) {
        console.log("Gemini overloaded, retrying...");
        await new Promise(r => setTimeout(r, 3000));
      } else if (err.status === 429) {
        console.error("Gemini quota exceeded");
        throw err;
      } else {
        throw err;
      }

    }
  }

  return "";
}

export async function generateSummary(
  text: string,
  language: string,
  length: string,
  format: string
) {

  const safeText = text.slice(0, 4000);

  const prompt = buildPrompt(
    safeText,
    language,
    length,
    format
  );

  const summary = await callGemini(prompt);

  return summary;
}

// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY!,
// });

// function buildPrompt(
//   text: string,
//   language: string,
//   length: string,
//   format: string
// ) {
//   const wordRange =
//     length === "Short" ? "100-150 words" : "300-400 words";

//   const formatInstruction =
//     format === "bullet"
//       ? `
// FORMAT RULES:
// - Use "-" at the start of each bullet.
// - Each bullet must be 1-2 sentences.
// - Do NOT number bullets.
// - Do NOT write paragraphs.
// `
//       : `
// FORMAT RULES:
// - Write as a single continuous paragraph.
// - Do NOT use bullet points.
// - Do NOT use numbering.
// `;

//   return `
// You are a strict summarization engine.

// OUTPUT LANGUAGE: ${language}
// SUMMARY LENGTH: ${wordRange}

// ${formatInstruction}

// Return ONLY the summary text.

// TEXT:
// """${text}"""
// `;
// }

// export async function generateSummary(
//   text: string,
//   language: string,
//   length: string,
//   format: string
// ) {
//   const safeText = text.slice(0, 4000);

//   const prompt = buildPrompt(safeText, language, length, format);

//   const response = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: [
//       {
//         role: "user",
//         parts: [{ text: prompt }],
//       },
//     ],
//   });

//   return response.text ?? "";
// }