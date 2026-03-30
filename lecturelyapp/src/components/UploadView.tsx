import React, { ChangeEvent, useState } from "react";
import { Upload, FileVideo, Languages, ChevronRight } from "lucide-react";
import { Sidebar } from "./Sidebar";
import logo from "../../public/assets/LA.png";
import { useSession } from "next-auth/react";

interface UploadViewProps {
  file: File | null;
  videoUrl: string | null;
  targetLang: string;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLanguageChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onStart: () => void;
  // isReady: boolean;
  title: string;
  setTitle: (value: string) => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
  file,
  videoUrl,
  targetLang,
  isDarkMode,
  toggleTheme,
  onFileUpload,
  onUrlChange,
  onLanguageChange,
  onStart,
  // isReady,
  title,
  setTitle,
}) => {
  const { status } = useSession();

  console.log("file:", file);
  console.log("videoUrl:", videoUrl);
  // console.log("isReady:", isReady);
  return (
    <div id="home" className="min-h-screen mt-16 md:mt-0 md:ml-64">
      <main className="max-w-4xl mx-auto p-6 animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white transition-colors">
            Understand Anything,{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              Instantly.
            </span>
          </h2>
          <p className="text-sm md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto transition-colors">
            Upload your course video. We use AI to generate timestamps and
            translate technical jargon accurately.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 md:px-10 rounded-3xl shadow-xl dark:shadow-2xl border border-indigo-50 dark:border-slate-700 text-center transition-all duration-300 hover:shadow-2xl">
          {/* Title */}
          <div className="md:flex md:w-full items-center md:gap-4 my-4">
            <input
              type="text"
              placeholder={
                status === "authenticated"
                  ? "Enter lecture title *"
                  : "Enter lecture title (optional)"
              }
              className="w-full md:w-96 p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required={status === "authenticated"}
            />

            <p className="text-sm text-gray-500">
              Required to save and identify your lecture later.
            </p>
          </div>

          {/* Url Input */}
          <div className="mb-1">
            <input
              type="text"
              placeholder="Paste YouTube URL"
              className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              // value={videoUrl && videoUrl.includes("youtube") ? videoUrl : ""}
              value={videoUrl?.startsWith("https") ? videoUrl : ""}
              onChange={onUrlChange}
            />
          </div>
          <p className="mb-1">(or)</p>

          {/* Drop Zone */}
          <div className="border-2 border-dashed border-indigo-200 dark:border-slate-600 rounded-2xl p-7 md:p-10 flex flex-col items-center justify-center bg-indigo-50/30 dark:bg-slate-800/50 hover:bg-indigo-50 dark:hover:bg-slate-700 transition cursor-pointer relative group">
            <input
              type="file"
              accept="video/*"
              className="absolute inset-0 md:w-full md:h-full opacity-0 cursor-pointer z-10"
              onChange={onFileUpload}
            />
            <div className="bg-white dark:bg-slate-700 p-2 md:p-4 rounded-full shadow-md mb-6 group-hover:scale-110 transition">
              {file ? (
                <FileVideo className="md:w-10 md:h-10 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <Upload className="md:w-10 md:h-10 text-indigo-600 dark:text-indigo-400" />
              )}
            </div>
            <h3 className="md:text-xl font-bold text-slate-700 dark:text-slate-200">
              {file ? file.name : "Drag & Drop video here"}
            </h3>
            <p className="text-[12px] md:text-lg text-slate-400 dark:text-slate-500 mt-2">
              MP4, MOV, or AVI (Max 2GB)
            </p>
          </div>

          {/* Controls */}
          <div className="mt-8 flex justify-center gap-4 items-center">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 border dark:border-slate-600 px-2 md:px-4 py-1 md:py-2 rounded-lg transition-colors">
              <Languages className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              <select
                className="bg-transparent font-medium text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
                value={targetLang}
                onChange={onLanguageChange}
              >
                <option className="text-black" value="ta">
                  Tamil
                </option>
                <option className="text-black " value="ja">
                  Japanese
                </option>
                <option className="text-black" value="hi">
                  Hindi
                </option>
                <option className="text-black" value="te">
                  Telugu
                </option>
                <option className="text-black" value="de">
                  German
                </option>
              </select>
            </div>

            <button
              onClick={onStart}
              disabled={!file && !videoUrl?.trim()}
              className={`flex items-center gap-2 px-4 md:px-8 py-1.5 md:py-3 rounded-xl font-bold text-sm md:text-lg transition shadow-lg transform active:scale-95 ${
                file || videoUrl
                  ? "bg-indigo-600 dark:bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-500/30"
                  : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
              }`}
            >
              Start Translation <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
