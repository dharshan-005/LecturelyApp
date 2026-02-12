// import { NextResponse } from "next/server";
// import { GoogleGenAI } from "@google/genai";
// import mammoth from "mammoth";

// // export const runtime = "nodejs";

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY!,
// });

// export async function POST(req: Request) {
//   try {
//     const formData = await req.formData();
//     const file = formData.get("file") as File | null;

//     if (!file) {
//       return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
//     }

//     const buffer = Buffer.from(await file.arrayBuffer());
//     let extractedText = "";

//     // ✅ PDF (WORKS 100%)
//     if (file.type === "application/pdf") {
//       const pdfParse = require("pdf-parse");
//       const data = await pdfParse(buffer);
//       // console.log("PDF text length:", data.text.length);
//       extractedText = data.text;
//     }

//     // ✅ DOCX
//     else if (
//       file.type ===
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//     ) {
//       const result = await mammoth.extractRawText({ buffer });
//       extractedText = result.value;
//     } else {
//       return NextResponse.json(
//         { error: "Unsupported file type" },
//         { status: 400 }
//       );
//     }

//     if (!extractedText.trim()) {
//       return NextResponse.json(
//         { error: "No readable text found in document" },
//         { status: 400 }
//       );
//     }

//     const safeText = extractedText.slice(0, 4000);

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: [
//         {
//           role: "user",
//           parts: [
//             {
//               text: `Summarize the following document clearly and concisely:\n\n${safeText}`,
//             },
//           ],
//         },
//       ],
//     });

//     return NextResponse.json({ summary: response.text });
//   } catch (err) {
//     console.error("Doc summarize error:", err);
//     return NextResponse.json(
//       { error: "Failed to summarize document" },
//       { status: 500 }
//     );
//   }
// }
