import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

async function callGemini(prompt: string) {
  const retries = 3;

  for (let i = 0; i < retries; i++) {
    try {
      const result = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return result.text ?? "Summary could not be generated.";
    } catch (err: any) {
      if (err.status === 429 && i < retries - 1) {
        console.warn("Gemini rate limit hit. Retrying...");
        await new Promise((r) => setTimeout(r, 5000));
      } else {
        throw err;
      }
    }
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, language, length, format } = body;

    if (!text) {
      return NextResponse.json(
        { error: "Text is required for summarization" },
        { status: 400 }
      );
    }

    // Prevent extremely large prompts
    const limitedText = text.slice(0, 12000);

    const prompt = `
Summarize the following lecture transcript.

Language: ${language}
Length: ${length}
Format: ${format}

Transcript:
${limitedText}
`;

    const summary = await callGemini(prompt);

    return NextResponse.json({ summary });

  } catch (error: any) {
    console.error("SUMMARY API ERROR:", error);

    if (error.status === 429) {
      return NextResponse.json(
        { error: "AI quota exceeded. Try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Summary generation failed" },
      { status: 500 }
    );
  }
}

// import { generateSummary } from "@/lib/summarizer";
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { text, language, length = "short", format = "paragraph" } = body;

//     if (!text) {
//       return NextResponse.json(
//         { error: "No text provided" },
//         { status: 400 }
//       );
//     }

//     const summary = await generateSummary(
//       text,
//       language,
//       length,
//       format
//     );

//     return NextResponse.json({ summary });

//   } catch (error) {
//     console.error("Summary API error:", error);

//     return NextResponse.json(
//       { error: "Failed to generate summary" },
//       { status: 500 }
//     );
//   }
// }

// import { generateSummary } from "@/lib/summarizer";
// import { NextResponse } from "next/dist/server/web/spec-extension/response";

// export async function POST(req: Request) {
//   const { text, language, length, format } = await req.json();

//   const summary = await generateSummary(
//     text,
//     language,
//     length,
//     format
//   );

//   return NextResponse.json({ summary });
// }
