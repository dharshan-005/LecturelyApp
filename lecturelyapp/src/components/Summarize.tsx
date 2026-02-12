"use client";

import { useState } from "react";

export default function LectureSummarize() {
  // Input states
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // UI states
  const [isTextMode, setIsTextMode] = useState(true);
  const [loading, setLoading] = useState(false);

  // Result
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
        // TEXT MODE
        res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            min_length: 40,
            max_length: 150,
            chunk_size: 400,
          }),
        });
      } else {
        // DOC MODE
        const formData = new FormData();
        formData.append("file", file!);

        res = await fetch("/api/summarize-doc", {
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
    } catch (err) {
      setSummary("Error connecting to server");
    }

    setLoading(false);
  };

  return (
    <div className="mx-11 h-screen">
      <h1 className="font-bold text-2xl mb-4">Summarize your content</h1>

      <div className="flex gap-6 pt-8 h-full">
        <div className="flex flex-col gap-2">
          {/* Mode Toggle */}
          <div className="flex gap-4 mb-4">
            <button
              className={`font-medium ${
                isTextMode ? "text-indigo-500" : "text-gray-500"
              }`}
              onClick={() => setIsTextMode(true)}
            >
              Text
            </button>

            <button
              className={`font-medium ${
                !isTextMode ? "text-indigo-500" : "text-gray-500"
              }`}
              onClick={() => setIsTextMode(false)}
            >
              Docs
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex gap-6">
            <div className="flex flex-col gap-3">
              {isTextMode ? (
                <textarea
                  className="w-96 border rounded-lg p-3 text-sm"
                  rows={6}
                  placeholder="Paste your text here..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              ) : (
                <label className="w-96 h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition">
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
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                {loading ? "Summarizing..." : "Generate Summary"}
              </button>
            </div>
          </form>
        </div>
        {/* Editable Summary */}
        <div className="flex-1 bg-gray-100 p-4 rounded-lg shadow w-full h-3/4">
          {summary ? (
            <>
              <h2 className="font-semibold mb-2">Editable Summary</h2>
              <textarea
                className="w-full h-11/12 p-2 border rounded"
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

// "use client";

// import { useState } from "react";

// export default function LectureSummary() {
//   const [text, setText] = useState("");
//   const [file, setFile] = useState<File | null>(null);

//   // Summary
//   const [summary, setSummary] = useState("");
//   const [loading, setLoading] = useState(false);

//   const generateSummary = async () => {
//     if (!text.trim()) return;

//     setLoading(true);

//     const res = await fetch("/api/summarize", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ text }),
//     });

//     const data = await res.json();
//     setSummary(data.summary);
//     setLoading(false);
//   };

//   return (
//     <div>
//       <textarea
//         placeholder="Enter text here..."
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />

//       <button onClick={generateSummary}>
//         {loading ? "Summarizing..." : "Generate Summary"}
//       </button>

//       {/* ✅ Editable summary */}
//       {summary && (
//         <div>
//           <h3>Editable Summary</h3>
//           <textarea
//             value={summary}
//             onChange={(e) => setSummary(e.target.value)}
//             rows={5}
//           />
//         </div>
//       )}
//     </div>
//   );
// }

// // "use client";

// // import { useState } from "react";

// // export default function LectureSummary({
// //   transcriptText,
// // }: {
// //   transcriptText: string;
// // }) {
// //   const [summary, setSummary] = useState("");
// //   const [loading, setLoading] = useState(false);

// //   const generateSummary = async () => {
// //     setLoading(true);

// //     const res = await fetch("/api/summarize", {
// //       method: "POST",
// //       headers: { "Content-Type": "application/json" },
// //       body: JSON.stringify({
// //         text: transcriptText,
// //         min_length: 40,
// //         max_length: 150,
// //         chunk_size: 400,
// //       }),
// //     });

// //     const data = await res.json();
// //     setSummary(data.summary);
// //     setLoading(false);
// //   };

// //   return (
// //     <div>
// //       <button onClick={generateSummary}>
// //         {loading ? "Summarizing..." : "Generate Summary"}
// //       </button>

// //       {summary && (
// //         <div>
// //           <h3>Lecture Summary</h3>
// //           <p>{summary}</p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }
