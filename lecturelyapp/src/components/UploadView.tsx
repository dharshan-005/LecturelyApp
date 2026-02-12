import React, { ChangeEvent, useState } from "react";
import { Upload, FileVideo, Languages, ChevronRight } from "lucide-react";
import { Navbar } from "./Navbar";

interface UploadViewProps {
  file: File | null;
  targetLang: string;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onFileUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onLanguageChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onStart: () => void;
}

export const UploadView: React.FC<UploadViewProps> = ({
  file,
  targetLang,
  isDarkMode,
  toggleTheme,
  onFileUpload,
  onLanguageChange,
  onStart,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <main className="max-w-4xl mx-auto p-6 animate-fade-in">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight text-slate-900 dark:text-white transition-colors">
            Go Global with{" "}
            <span className="text-indigo-600 dark:text-indigo-400">
              One Click.
            </span>
          </h2>
          <p className="text-sm md:text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto transition-colors">
            Upload your course video. We use AI to generate timestamps and
            translate technical jargon accurately.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm p-6 md:p-10 rounded-3xl shadow-xl dark:shadow-2xl border border-indigo-50 dark:border-slate-700 text-center transition-all duration-300 hover:shadow-2xl">
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
                <option className="text-black " value="Japanese">
                  Japanese
                </option>
                <option className="text-black" value="Hindi">
                  Hindi
                </option>
                <option className="text-black" value="Tamil">
                  Tamil
                </option>
                <option className="text-black" value="Telugu">
                  Telugu
                </option>
                <option className="text-black" value="German">
                  German
                </option>
              </select>
            </div>

            <button
              onClick={onStart}
              disabled={!file}
              className={`flex items-center gap-2 px-4 md:px-8 py-1.5 md:py-3 rounded-xl font-bold text-sm md:text-lg transition shadow-lg transform active:scale-95 ${
                file
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
