// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const res = await fetch("http://127.0.0.1:8000/api/summarize", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         text: body.text,
//         min_length: body.min_length ?? 40,
//         max_length: body.max_length ?? 150,
//         chunk_size: body.chunk_size ?? 400
//       })
//     });

//     if (!res.ok) {
//       throw new Error("Summarization service failed");
//     }

//     const data = await res.json();

//     return NextResponse.json({ summary: data.summary });

//   } catch (err) {
//     console.error("Summarization error:", err);

//     return NextResponse.json(
//       { error: "Failed to summarize text" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Input text is empty." },
        { status: 400 }
      );
    }

    const safeText = text.slice(0, 4000);

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `Summarize the following text clearly and concisely:\n\n${safeText}`,
            },
          ],
        },
      ],
    });

    return NextResponse.json({
      summary: response.text,
    });
  } catch (err) {
    console.error("Gemini SDK error:", err);

    return NextResponse.json(
      {
        error:
          err instanceof Error ? err.message : "Unknown server error",
      },
      { status: 500 }
    );
  }
}
