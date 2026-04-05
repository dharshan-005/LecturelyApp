"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { AlignLeft, ChevronDown, Clipboard, List, Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function SummaryNew() {
  const [openLang, setOpenLang] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("Language");

  const [openShort, setOpenShort] = useState(false);
  const [selectedLength, setSelectedLength] = useState("Short");

  const [format, setFormat] = useState("paragraph");

  // Summary logic here
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const [inputMode, setInputMode] = useState<"none" | "text" | "file">("none");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [viewMode, setViewMode] = useState<"input" | "result">("input");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputMode === "none") {
      setSummary("Please choose Paste or Upload mode.");
      return;
    }

    if (inputMode === "text" && !text.trim()) {
      setSummary("Please provide a text to summarize.");
      return;
    }

    if (inputMode === "file" && !file) {
      setSummary("Please upload a document to summarize.");
      return;
    }

    setLoading(true);
    setSummary("");

    try {
      let res: Response;

      if (inputMode === "text") {
        res = await fetch("/api/summarize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text,
            language: selectedLanguage,
            length: selectedLength,
            format,
          }),
        });
      } else {
        const formData = new FormData();
        formData.append("file", file!);
        formData.append("language", selectedLanguage);
        formData.append("length", selectedLength);
        formData.append("format", format);

        res = await fetch("/api/summarize-doc", {
          method: "POST",
          body: formData,
        });
      }

      if (!res.ok) {
        const errorText = await res.text();
        setSummary(errorText || "Failed to generate summary");
        return;
      }

      const data = await res.json();
      setSummary(data.summary || "No summary returned");

      if (inputMode === "file") {
        setText(data.original || "Original content not returned");
      }
      setViewMode("result");
    } catch (err) {
      setSummary("Error connecting to server");
    }

    setLoading(false);
  };

  return (
    <>
      <div
        id="summary"
        className="min-h-screen p-4 md:pt-10 md:ml-64"
      >
        <div className="flex justify-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Summary
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mx-auto w-full lg:max-w-6xl border-2 rounded-2xl bg-white dark:bg-slate-900 overflow-hidden"
        >
          {/* Top level Controls */}
          <div className="flex flex-col lg:flex-row gap-4 p-4 justify-between border-b">
            <div className="flex flex-col sm:flex-row gap-4 w-auto">
              <div
                onMouseEnter={() => setOpenLang(true)}
                onMouseLeave={() => setOpenLang(false)}
                className="w-full sm:w-auto"
              >
                <DropdownMenu
                  modal={false}
                  open={openLang}
                  onOpenChange={setOpenLang}
                >
                  <DropdownMenuTrigger className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer border-2 p-2 w-full sm:w-40 justify-between rounded-2xl flex flex-row items-center gap-1 bg-transparent">
                    <h1 className="text-sm font-medium">{selectedLanguage}</h1>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${openLang ? "rotate-180" : "rotate-0"}`}
                    />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    className="w-40 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg z-50"
                  >
                    {["English", "Japanese", "Tamil", "Hindi"].map((lang) => (
                      <DropdownMenuItem
                        key={lang}
                        onSelect={() => setSelectedLanguage(lang)}
                        className="cursor-pointer outline-none p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded-lg"
                      >
                        {lang}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div
                onMouseEnter={() => setOpenShort(true)}
                onMouseLeave={() => setOpenShort(false)}
                className="w-full sm:w-auto"
              >
                <DropdownMenu
                  modal={false}
                  open={openShort}
                  onOpenChange={setOpenShort}
                >
                  <DropdownMenuTrigger className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer border-2 w-full sm:w-52 justify-between p-2 rounded-2xl flex flex-row items-center gap-1 bg-transparent">
                    <h1 className="text-sm font-medium">{selectedLength}</h1>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${openShort ? "rotate-180" : "rotate-0"}`}
                    />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    className="w-40 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg z-50"
                  >
                    {["Short", "Long"].map((len) => (
                      <DropdownMenuItem
                        key={len}
                        onSelect={() => setSelectedLength(len)}
                        className="cursor-pointer outline-none p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900 rounded-lg"
                      >
                        {len}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Paragraph and Bullet Toggle */}
            <div className="flex gap-1 items-center justify-around w-full lg:w-auto bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 h-12 lg:h-10">
              <button
                type="button"
                onClick={() => setFormat("paragraph")}
                className={`flex flex-1 lg:flex-none px-4 py-1.5 cursor-pointer rounded-xl items-center justify-center transition-all ${
                  format === "paragraph"
                    ? "bg-white dark:bg-gray-700 shadow-sm"
                    : "text-gray-500 hover:text-indigo-600"
                }`}
              >
                <AlignLeft className="w-4 h-4" />
                <span className="ml-2 text-sm">Paragraph</span>
              </button>

              <button
                type="button"
                onClick={() => setFormat("bullet")}
                className={`flex flex-1 lg:flex-none px-4 py-1.5 cursor-pointer rounded-xl items-center justify-center transition-all ${
                  format === "bullet"
                    ? "bg-white dark:bg-gray-700 shadow-sm"
                    : "text-gray-500 hover:text-indigo-600"
                }`}
              >
                <List className="w-4 h-4" />
                <span className="ml-2 text-sm">Bullet Points</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="p-4">
            {viewMode === "input" ? (
              <div className="w-full">
                <textarea
                  className="w-full h-64 md:h-80 border rounded-xl p-4 text-sm bg-white dark:bg-gray-800 text-black dark:text-white resize-none outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder={
                    inputMode === "file" && file
                      ? `Selected file: ${file.name}`
                      : inputMode === "file"
                        ? "Upload a document to summarize..."
                        : 'Enter or paste your text and press "Summarize"...'
                  }
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  disabled={inputMode === "file"}
                />

                <div className="flex flex-wrap gap-4 mt-4">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const clipboardText =
                          await navigator.clipboard.readText();
                        if (!clipboardText) return;
                        setInputMode("text");
                        setFile(null);
                        setText(clipboardText);
                      } catch {
                        alert("Clipboard permission denied.");
                      }
                    }}
                    className="flex flex-1 sm:flex-none items-center justify-center gap-2 border border-indigo-600 text-indigo-700 px-6 py-2.5 rounded-full hover:bg-indigo-50 transition text-sm font-medium"
                  >
                    <Clipboard className="w-4 h-4" />
                    Paste
                  </button>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-1 sm:flex-none items-center justify-center gap-2 border border-indigo-600 text-indigo-700 px-6 py-2.5 rounded-full hover:bg-indigo-50 transition text-sm font-medium"
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                </div>
              </div>
            ) : (
              /* RESULT VIEW - Responsive Grid */
              <div className="flex flex-col lg:flex-row gap-4 min-h-[400px]">
                {/* Original Content */}
                <div className="w-full lg:w-1/2 border rounded-xl p-4 overflow-auto bg-gray-50 dark:bg-gray-800/50">
                  <h2 className="font-semibold mb-2 text-slate-700 dark:text-slate-200">
                    Original
                  </h2>
                  <p className="text-sm whitespace-pre-wrap text-slate-600 dark:text-slate-400">
                    {text || "Original content not available"}
                  </p>
                </div>

                {/* Summarized Content */}
                <div className="w-full lg:w-1/2 border rounded-xl p-4 overflow-auto bg-white dark:bg-gray-800 shadow-sm">
                  <div className="flex justify-between items-center mb-2 border-b pb-2">
                    <h2 className="font-semibold text-slate-800 dark:text-slate-100">
                      Summarized
                    </h2>
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode("input");
                        setSummary("");
                        setText("");
                        setFile(null);
                        setInputMode("none");
                      }}
                      className="text-indigo-600 text-sm font-bold hover:underline"
                    >
                      New Summary
                    </button>
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300">
                    {summary}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Footer */}
          <div className="p-4 flex justify-end bg-gray-50 dark:bg-transparent border-t lg:border-none">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 active:scale-95 shadow-md"
            >
              {loading ? "Summarizing..." : "Summarize Now"}
            </button>
          </div>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setFile(e.target.files[0]);
                setInputMode("file");
                setText("");
              }
            }}
          />
        </form>
      </div>
    </>
  );
}
