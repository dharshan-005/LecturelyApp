import React, { useState } from "react";

const Summary = () => {
  // Text and file
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Summary
  const [summary, setSummary] = useState("");

  // Active or inactive for toggling
  const [isActive, setIsActive] = useState(true);

  // Loading
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isActive && !text.trim()) {
      setSummary("Please provide a text to summarize.");
      return;
    }

    if (!isActive && !file) {
      setSummary("Please upload a document to summarize.");
      return;
    }

    setLoading(true);
    setSummary("");

    try {
      let res;

      if (isActive) {
        // TEXT MODE
        res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
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
    <>
      <div id="summary" className="mx-11 h-screen mb-40 pt-10">
        <h1 className="font-bold text-xl md:text-2xl mb-4">
          Summarize your content
        </h1>

        <div className="flex flex-col md:flex-row gap-6 pt-8 h-full">
          <div className="flex items-center flex-col gap-2">
            {/* Mode Toggle */}
            <div className="flex gap-4 mb-4">
              <button
                className={`font-medium pb-2 border-b-2 cursor-pointer ${
                  isActive ? "text-indigo-500 border-indigo-500" : "text-gray-500"
                }`}
                onClick={() => setIsActive(true)}
              >
                Text
              </button>

              <button
                className={`font-medium pb-2 border-b-2 cursor-pointer ${
                  !isActive ? "text-indigo-500 border-indigo-500" : "text-gray-500"
                }`}
                onClick={() => setIsActive(false)}
              >
                Docs
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex gap-6">
              <div className="flex flex-col gap-3">
                {isActive ? (
                  <textarea
                    className="w-80 md:w-[500px] h-35 md:h-50 border rounded-lg p-3 text-sm"
                    rows={6}
                    placeholder="Paste your text here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                ) : (
                  <label className="w-80 md:w-[500px] h-35 md:h-50 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition">
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
    </>
  );
};

export default Summary;
