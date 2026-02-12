"use client";

import { useState } from "react";

export default function LectureSummary() {
  // Inputs
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // UI state
  const [isTextMode, setIsTextMode] = useState(true);
  const [loading, setLoading] = useState(false);

  // Output
  const [summary, setSummary] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (isTextMode && !text.trim()) {
      setSummary("Please provide text to summarize.");
      return;
    }

    if (!isTextMode && !file) {
      setSummary("Please upload a document to summarize.");
      return;
    }

    setLoading(true);
    setSummary("");

    try {
      let res: Response;

      if (isTextMode) {
        // ✅ TEXT → Next.js route.ts (Gemini)
        res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
      } else {
        // ✅ DOC → FastAPI (Python)
        const formData = new FormData();
        formData.append("file", file as File);

        res = await fetch("http://localhost:8000/api/summarize", {
          method: "POST",
          body: formData,
        });
      }

      const data = await res.json();

      if (!res.ok) {
        setSummary(data.error || "Failed to generate summary");
      } else {
        setSummary(data.summary || "No summary returned");
      }
    } catch (error) {
      console.error(error);
      setSummary("Error connecting to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="summary" className="mx-11 h-screen pt-10">
      <h1 className="font-bold text-xl md:text-2xl mb-4">
        Summarize your content
      </h1>

      <div className="flex flex-col md:flex-row gap-6 pt-8 h-full">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4">
          {/* Mode Toggle */}
          <div className="flex gap-6">
            <button
              className={`font-medium pb-2 border-b-2 ${
                isTextMode
                  ? "text-indigo-500 border-indigo-500"
                  : "text-gray-500 border-transparent"
              }`}
              onClick={() => setIsTextMode(true)}
            >
              Text
            </button>

            <button
              className={`font-medium pb-2 border-b-2 ${
                !isTextMode
                  ? "text-indigo-500 border-indigo-500"
                  : "text-gray-500 border-transparent"
              }`}
              onClick={() => setIsTextMode(false)}
            >
              Docs
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isTextMode ? (
              <textarea
                className="w-80 md:w-[500px] h-40 border rounded-lg p-3 text-sm"
                placeholder="Paste your text here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            ) : (
              <label className="w-80 md:w-[500px] h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && setFile(e.target.files[0])
                  }
                />
                <p className="text-sm text-gray-600">
                  {file ? file.name : "Click or drag a document"}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  PDF, DOC, DOCX supported
                </p>
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-60"
            >
              {loading ? "Summarizing..." : "Generate Summary"}
            </button>
          </form>
        </div>

        {/* RIGHT SIDE – Editable Summary */}
        <div className="flex-1 bg-gray-100 p-4 rounded-lg shadow w-full h-3/4">
          {summary ? (
            <>
              <h2 className="font-semibold mb-2">Editable Summary</h2>
              <textarea
                className="w-full h-[85%] p-2 border rounded"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
              />
            </>
          ) : (
            <p className="text-gray-500">Summary will appear here...</p>
          )}
        </div>
      </div>
    </div>
  );
}
