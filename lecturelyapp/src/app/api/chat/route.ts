// import { NextResponse } from "next/server";
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY!,
// });

// // Retry helper for Gemini rate limits
// async function callGemini(prompt: string) {
//   const retries = 3;

//   for (let i = 0; i < retries; i++) {
//     try {
//       const result = await ai.models.generateContent({
//         model: "gemini-2.5-flash",
//         contents: prompt,
//       });

//       return result.text ?? "I couldn't generate a response.";
//     } catch (err: any) {
//       if (err.status === 429 && i < retries - 1) {
//         console.warn("Gemini rate limited. Retrying in 5 seconds...");
//         await new Promise((r) => setTimeout(r, 5000));
//       } else {
//         throw err;
//       }
//     }
//   }
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const question = body.question;
//     const context = body.context;

//     if (!question) {
//       return NextResponse.json(
//         { error: "Question is required" },
//         { status: 400 }
//       );
//     }

//     // Limit transcript size to avoid huge token usage
//     const limitedContext = context ? context.slice(0, 12000) : "";

//     const prompt = `
// You are a lecture assistant helping students understand a lecture.

// Lecture content:
// ${limitedContext}

// Student question:
// ${question}

// Answer clearly and concisely.
// `;

//     const answer = await callGemini(prompt);

//     return NextResponse.json({
//       answer,
//     });

//   } catch (error: any) {
//     console.error("CHAT API ERROR:", error);

//     if (error.status === 429) {
//       return NextResponse.json(
//         { error: "AI quota exceeded. Please try again later." },
//         { status: 429 }
//       );
//     }

//     return NextResponse.json(
//       { error: "Chatbot failed" },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY!,
// });

// export async function POST(req: Request) {
//   try {
//     const { question, context } = await req.json();

//     const limitedContext = context.slice(0, 12000);

//     const prompt = `
// You are a lecture assistant.

// Lecture content:
// ${limitedContext}

// Student question:
// ${question}

// Answer clearly.
// `;

//     const result = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: prompt,
//     });

//     const text = result.text ?? "Sorry, I couldn't generate a response.";

//     return NextResponse.json({
//       answer: result.text,
//     });
//   } catch (error) {
//     console.error("CHAT API ERROR:", error);

//     return NextResponse.json({ error: "Chatbot failed" }, { status: 500 });
//   }
// }
