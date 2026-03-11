import { generateSummary } from "@/lib/summarizer";
import { NextResponse } from "next/dist/server/web/spec-extension/response";

export async function POST(req: Request) {
  const formData = await req.formData();

  const file = formData.get("file") as File;
  const language = formData.get("language") as string;
  const length = formData.get("length") as string;
  const format = formData.get("format") as string;

  // Send file to Python extractor
  const pythonRes = await fetch("http://localhost:8000/extract", {
    method: "POST",
    body: formData,
  });

  const { extractedText } = await pythonRes.json();

  const summary = await generateSummary(
    extractedText,
    language,
    length,
    format,
  );

  return NextResponse.json({ summary, original: extractedText });
}

// export async function POST() {
//   return new Response("Not implemented", { status: 501 });
// }
