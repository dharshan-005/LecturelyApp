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

  //   Summary logic here
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const [inputMode, setInputMode] = useState<"none" | "text" | "file">("none"); // "text" or "file"

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
        // TEXT MODE (Gemini)
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
        // DOC MODE (Python API)
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
      <div id="summary" className="w-full h-screen p-4">
        <div className="flex justify-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            Summary
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-[97.5%] h-10/12 m-4 border-2 rounded-2xl"
        >
          {/* Top level */}
          <div className="flex justify-around p-4">
            <div
              onMouseEnter={() => setOpenLang(true)}
              onMouseLeave={() => setOpenLang(false)}
            >
              <DropdownMenu
                modal={false}
                open={openLang}
                onOpenChange={setOpenLang}
              >
                <DropdownMenuTrigger
                  //   onMouseEnter={() => setOpenLang(true)}
                  //   onMouseLeave={() => setOpenLang(false)}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer border-2 p-2 w-40 justify-between rounded-2xl flex flex-row items-center gap-1"
                >
                  <h1 className="text-sm font-medium">{selectedLanguage}</h1>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      openLang ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  className="w-40 bg-gray-100 dark:bg-gray-800 rounded-lg"
                >
                  <DropdownMenuItem
                    onSelect={() => setSelectedLanguage("English")}
                    className="cursor-pointer outline-none focus:outline-none data-highlighted:data-highlighted:text-indigo-600 rounded-lg p-2"
                  >
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setSelectedLanguage("Japanese")}
                    className="cursor-pointer outline-none focus:outline-none data-highlighted:text-indigo-600 rounded-lg p-2"
                  >
                    Japanese
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setSelectedLanguage("Tamil")}
                    className="cursor-pointer outline-none focus:outline-none data-highlighted:text-indigo-600 rounded-lg p-2"
                  >
                    Tamil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => setSelectedLanguage("Hindi")}
                    className="cursor-pointer outline-none focus:outline-none data-highlighted:text-indigo-600 rounded-lg p-2"
                  >
                    Hindi
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex gap-4">
              <div
                onMouseEnter={() => setOpenShort(true)}
                onMouseLeave={() => setOpenShort(false)}
              >
                <DropdownMenu
                  modal={false}
                  open={openShort}
                  onOpenChange={setOpenShort}
                >
                  <DropdownMenuTrigger
                    // onMouseEnter={() => setOpenShort(true)}
                    // onMouseLeave={() => setOpenShort(false)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 cursor-pointer border-2 w-52 justify-between p-2 rounded-2xl flex flex-row items-center gap-1"
                  >
                    <h1 className="text-sm font-medium">{selectedLength}</h1>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        openShort ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="start"
                    className="w-40 bg-gray-100 dark:bg-gray-800 rounded-lg"
                  >
                    <DropdownMenuItem
                      onSelect={() => setSelectedLength("Short")}
                      className="cursor-pointer outline-none focus:outline-none data-highlighted:text-indigo-600 rounded-lg p-2"
                    >
                      Short
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onSelect={() => setSelectedLength("Long")}
                      className="cursor-pointer outline-none focus:outline-none data-highlighted:text-indigo-600 rounded-lg p-2"
                    >
                      Long
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Paragraph and Bullet */}
              <div className="flex gap-1 items-center justify-around w-79 bg-gray-100 dark:bg-gray-500 rounded-2xl p-2 h-10">
                <button
                  onClick={() => setFormat("paragraph")}
                  className={`flex w-auto px-4 py-1 cursor-pointer rounded-xl items-center transition-all ${format === "paragraph" ? "bg-white dark:bg-gray-800 shadow-sm" : "hover:text-indigo-600 dark:text-black"}`}
                >
                  <AlignLeft className="w-4 h-4" />
                  <span className="ml-2">Paragraph</span>
                </button>

                <button
                  onClick={() => setFormat("bullet")}
                  className={`flex w-auto px-4 py-1 cursor-pointer rounded-xl items-center transition-all ${format === "bullet" ? "bg-white dark:bg-gray-800 shadow-sm" : "hover:text-indigo-600 dark:text-black"}`}
                >
                  <List className="w-4 h-4" />
                  <span className="ml-2">Bullet Points</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-[97.5%] h-9/12 ml-4 border-2 rounded-2xl p-4">
            {viewMode === "input" ? (
              <>
                <textarea
                  className="w-full h-64 border rounded-xl p-4 text-sm bg-white dark:bg-gray-800 text-black dark:text-white resize-none"
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

                {/* Paste + Upload */}
                <div className="flex gap-4 mt-4">
                  {/* Paste Button */}
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
                    className="flex items-center gap-2 border border-indigo-600 text-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-50 transition"
                  >
                    <Clipboard className="w-4 h-4" />
                    Paste
                  </button>

                  {/* Upload Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 border border-indigo-600 text-indigo-700 px-4 py-2 rounded-full hover:bg-indigo-50 transition"
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                </div>
              </>
            ) : (
              /* RESULT VIEW */
              <div className="flex gap-4 h-full">
                {/* Original */}
                <div className="w-1/2 border rounded-xl p-4 overflow-auto bg-gray-50">
                  <h2 className="font-semibold mb-2">Original</h2>
                  <p className="text-sm whitespace-pre-wrap">
                    {text || "Original content not available"}
                  </p>
                </div>

                {/* Summarized */}
                <div className="w-1/2 border rounded-xl p-4 overflow-auto bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="font-semibold">Summarized</h2>
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode("input");
                        setSummary("");
                        setText("");
                        setFile(null);
                        setInputMode("none");
                      }}
                      className="text-indigo-600 text-sm hover:underline"
                    >
                      New
                    </button>
                  </div>

                  <p className="text-sm whitespace-pre-wrap">{summary}</p>
                </div>
              </div>
            )}
          </div>
          <div className="w-[97.5%] flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-500 text-white cursor-pointer p-2 rounded-xl m-4 disabled:opacity-50"
            >
              {loading ? "Summarizing..." : "Summarize"}
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
