"use client";

import React, { useEffect, useRef, useState } from "react";
import { Play, Download, Globe, Edit3, Moon, Sun, Menu, X } from "lucide-react";
import { Subtitle } from "../types";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import logo from "../../public/assets/LA.png";
import { useApp } from "@/context/AppContext";
import { Smokum } from "next/font/google";

import { BsPerson, BsPlus } from "react-icons/bs";
import { ExportMode } from "@/utils/subtitleExport";

function getYouTubeId(url: string) {
  const match = url.match(/v=([^&]+)/);
  return match ? match[1] : null;
}

interface EditorViewProps {
  subtitles: Subtitle[];
  targetLang: string;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onSubtitleChange: (id: number, newText: string) => void;
  onDownload: (format: "srt" | "vtt" | "txt" | "json", mode: ExportMode) => void;
  onNewProject: () => void;
  // summary: string;
  // loadingSummary: boolean;
  summary: string;
  keyPoints: string[];
  concepts: string[];

  videoSrc?: string | null;
}

// type ExportMode = "original" | "translated" | "bilingual";

const languageNames: Record<string, string> = {
  ta: "Tamil",
  hi: "Hindi",
  ja: "Japanese",
  de: "German",
  en: "English",
};

export const EditorView: React.FC<EditorViewProps> = ({
  subtitles,
  targetLang,
  onSubtitleChange,
  onDownload,
  onNewProject,
  summary,
  // loadingSummary,
  keyPoints,
  concepts,
  videoSrc,
}) => {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const router = useRouter();

  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentTime, setCurrentTime] = useState(0);

  console.log("SUBTITLE SAMPLE:", subtitles[0]);

  const activeSubtitle = subtitles.find(
    (sub) => currentTime >= sub.start && currentTime <= sub.end,
  );

  const { isDarkMode, toggleTheme } = useApp();

  const subtitlerefs = useRef<Record<number, HTMLDivElement | null>>({});
  const [showTranslated, setShowTranslated] = useState(true);

  // Download file
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [exportMode, setExportMode] = useState<ExportMode>("translated");
  const [format, setFormat] = useState<"srt" | "vtt" | "txt" | "json">("srt");

  const modes: ExportMode[] = ["original", "translated", "bilingual"];
  const formats: ("srt" | "vtt" | "txt" | "json")[] = ["srt", "vtt", "txt", "json"];

  useEffect(() => {
    if (activeSubtitle && subtitlerefs.current[activeSubtitle.id]) {
      subtitlerefs.current[activeSubtitle.id]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeSubtitle]);

  return (
    <>
      <div>
        <div className="min-h-screen from-indigo-50 to-white dark:from-slate-950 dark:to-slate-900 bg-linear-to-br text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300 flex flex-col">
          {/* Editor Navbar */}
          <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 md:p-6 w-full bg-white dark:bg-black border-b border-slate-200 dark:border-slate-800 shadow-md">
            <div className="flex items-center gap-2">
              {/* Logo */}
              <a href="/" className="flex items-center gap-2">
                <img src={logo.src} className="w-10 h-10 rounded-xl" />
                <span className="hidden md:flex font-bold text-2xl">
                  Lecturely.AI
                </span>
              </a>
              <span className="bg-green-100 w-15.5 md:w-18 dark:bg-indigo-500/10 text-green-700 dark:text-indigo-400 text-[8px] px-2 py-0.5 md:text-[10px] rounded-full font-medium ml-2 border dark:border-indigo-500/20">
                Editor Mode
              </span>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3 md:gap-6">
              {/* ========== MOBILE ========== */}
              <div className="flex items-center gap-3 md:hidden">
                {/* Theme */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full cursor-pointer"
                >
                  {isDarkMode ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </button>

                <button
                  onClick={onNewProject}
                  className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white p-1 rounded-xl w-8 h-8 flex items-center justify-center cursor-pointer"
                >
                  <BsPlus className="w-5 h-5" />
                </button>

                {/* Profile */}
                <div className="relative">
                  <button
                    onClick={() => router.push("/profile")}
                    className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer"
                  >
                    <BsPerson />
                  </button>
                </div>
              </div>

              {/* ========== DESKTOP ========== */}
              <div className="hidden md:flex items-center gap-6">
                {/* Theme */}
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full cursor-pointer"
                >
                  {isDarkMode ? (
                    <Moon className="w-5 h-5" />
                  ) : (
                    <Sun className="w-5 h-5" />
                  )}
                </button>

                {/* New Project */}
                <button
                  onClick={onNewProject}
                  className="text-sm font-medium text-black dark:text-white hover:text-indigo-500 dark:hover:text-indigo-500 cursor-pointer"
                >
                  New Project
                </button>

                <div className="relative">
                  <button
                    onClick={() => router.push("/profile")}
                    className="p-2 w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 cursor-pointer flex items-center justify-center"
                  >
                    <BsPerson className="w-5 h-5" />
                  </button>
                </div>

                {/* <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div> */}
              </div>
            </div>
          </nav>
          {/* End of navBar */}

          {/* Main Workspace */}
          <div className="mt-24 md:p-5">
            <main className="flex flex-col md:flex-row w-full md:h-[calc(100vh-100px)] overflow-hidden">
              {/* Left: Video Preview */}
              <div className="md:w-1/2 flex flex-col items-center justify-center relative">
                {/* Video Player */}
                <div className="w-full aspect-video overflow-hidden relative group">
                  {videoSrc ? (
                    videoSrc.includes("youtube") ? (
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeId(videoSrc)}`}
                        className="absolute inset-0 w-full h-full"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        ref={videoRef}
                        src={videoSrc}
                        controls
                        preload="metadata"
                        onTimeUpdate={() => {
                          if (videoRef.current) {
                            setCurrentTime(videoRef.current.currentTime);
                          }
                        }}
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    )
                  ) : (
                    <div>Video Placeholder</div>
                  )}

                  {/* video play */}
                  {subtitles.length > 0 && (
                    <div className="absolute bottom-[8%] left-0 right-0 flex justify-center px-4 pointer-events-none">
                      <span className="bg-black/60 text-white px-3 py-1.5 rounded-md text-xs md:text-sm leading-snug text-center max-w-[80%] wrap-break-word backdrop-blur-sm">
                        {/* {subtitles[0].translated} */}
                        {/* {activeSubtitle?.translated || activeSubtitle?.original} */}
                        {showTranslated
                          ? activeSubtitle?.translated ||
                            activeSubtitle?.original
                          : activeSubtitle?.original}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Subtitle Editor */}
              <div className="md:w-1/2 bg-white dark:bg-slate-900 flex flex-col border-l border-slate-200 dark:border-slate-800 transition-colors rounded-2xl">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">
                      Subtitle Tracks
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      English (Original) &rarr;{" "}
                      {languageNames[targetLang] || targetLang}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <button
                      onClick={() => setShowTranslated((prev) => !prev)}
                      className="px-2 py-1 text-xs bg-indigo-500 text-white rounded"
                    >
                      {showTranslated ? "Original" : "Translated"}
                    </button>
                    <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 rounded-lg">
                      <Globe className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {subtitles.map((sub) => (
                    <div
                      key={sub.id}
                      ref={(el) => {
                        subtitlerefs.current[sub.id] = el;
                      }}
                      className={`group border rounded-xl p-4 transition bg-white dark:bg-slate-800 ${activeSubtitle?.id === sub.id ? "border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-500/30" : "border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500"}`}
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = sub.start;
                        }
                      }}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 text-xs font-mono px-2 py-1 rounded">
                          {sub.start} &rarr; {sub.end}
                        </span>
                        <Edit3 className="w-4 h-4 text-slate-300 dark:text-slate-500 group-hover:text-indigo-400" />
                      </div>

                      <div className="mb-3">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1 font-medium">
                          Original
                        </p>
                        <div className="text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900/50 p-2 rounded text-sm select-none border border-transparent dark:border-slate-700">
                          {sub.original}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-indigo-600 dark:text-indigo-400 mb-1 font-medium flex items-center gap-2">
                          {languageNames[targetLang] || targetLang}{" "}
                          <span className="text-[10px] bg-indigo-100 dark:bg-indigo-500/20 px-1.5 rounded text-indigo-700 dark:text-indigo-300">
                            Editable
                          </span>
                        </p>
                        <textarea
                          className="w-full p-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-lg text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                          rows={2}
                          value={sub.translated}
                          onChange={(e) =>
                            onSubtitleChange(sub.id, e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                  {/* <div className="">
                  <Contact />
                </div> */}
                </div>
              </div>
            </main>

            {/* ================= FLOATING DOWNLOAD ================= */}
            <button
              onClick={() => setShowDownloadModal(true)}
              className="fixed bottom-6 right-6 z-50 bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg"
            >
              <Download className="w-5 h-5" />
            </button>

            <div className="border-t border-slate-200 dark:border-slate-700 p-4 m-4">
              {/* Summary */}
              <h3 className="font-bold text-center mb-2">Summary</h3>
              <p className="text-sm whitespace-pre-line">{summary}</p>

              {/* Key Points */}
              {keyPoints?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Key Points</h3>
                  <ul className="list-disc ml-5 text-sm">
                    {keyPoints.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Concepts */}
              {concepts?.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-bold mb-2">Important Concepts</h3>
                  <div className="flex flex-wrap gap-2">
                    {concepts.map((c, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-indigo-100 rounded text-xs"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* <div className="border-t border-slate-200 dark:border-slate-700 p-4 m-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-2 flex justify-center">
                AI Summary
              </h3>

              {loadingSummary ? (
                <p className="text-sm text-slate-500">Generating summary...</p>
              ) : (
                <p className="text-sm text-slate-600 dark:text-slate-300 whitespace-pre-line">
                  {summary}
                </p>
              )}
            </div> */}
          </div>
        </div>
      </div>

      {/* Download Modal */}
      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-bold mb-4">Download Subtitles</h2>

            {/* FORMAT */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Format</p>
              <div className="flex gap-2">
                {formats.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormat(f as any)}
                    className={`px-3 py-1 rounded ${
                      format === f
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  >
                    {f.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* MODE */}
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Content</p>
              <div className="flex flex-col gap-2">
                {modes.map((m) => (
                  <button
                    key={m}
                    onClick={() => setExportMode(m as any)}
                    className={`px-3 py-2 rounded text-left ${
                      exportMode === m
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-200 dark:bg-slate-700"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-4 py-2 rounded bg-slate-300 dark:bg-slate-700"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  onDownload(format, exportMode);
                  setShowDownloadModal(false);
                }}
                className="px-4 py-2 rounded bg-indigo-600 text-white"
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
