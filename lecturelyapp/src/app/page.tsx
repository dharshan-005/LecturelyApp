"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
// import { Subtitle, AppView } from "../types";
import { UploadView } from "../components/UploadView";
// import { ProcessingView } from "../components/ProcessingView";
// import { EditorView } from "../components/EditorView";
import { Sidebar } from "@/components/Sidebar";
import Contact from "@/components/Contact";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useApp } from "@/context/AppContext";
import Tools from "@/components/Tools";
import { useTheme } from "@/context/ThemeContext";
import SummaryNew from "@/components/SummaryNew";

export default function LecturelyApp() {
  const { file, setFile, transcriptText, videoUrl, setVideoUrl } = useApp();
  // const [isReady, setIsReady] = useState(false);

  // --- Theme State ---
  const { isDarkMode, toggleTheme } = useTheme();
  
  const { targetLang, setTargetLang } = useApp();
  const [title, setTitle] = useState("");

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };

      video.onerror = () => reject("Failed to load metadata");

      video.src = URL.createObjectURL(file);
    });
  };

  // --- Handlers ---
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // setIsReady(false); // ⛔ disable start

    setFile(selectedFile);

    const previewUrl = URL.createObjectURL(selectedFile);
    setVideoUrl(previewUrl);

    try {
      const duration = await getVideoDuration(selectedFile);

      console.log("Video duration (seconds):", duration);

      localStorage.setItem("videoDuration", duration.toString());

      // setIsReady(true); // ✅ enable start
    } catch (err) {
      console.error("Duration error:", err);
    }
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTargetLang(e.target.value);
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  const startProcessing = () => {
    if (!file && !videoUrl) {
      alert("Please upload a video or provide a URL.");
      return;
    }

    // if (!isReady) {
    //   alert("Please wait, processing video metadata...");
    //   return;
    // }

    router.push("/processing");
  };

  const router = useRouter();

  return (
    <>
      <div>
        <div className="from-indigo-50 to-white dark:from-slate-950 dark:to-slate-900 bg-linear-to-br text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
          <Sidebar />

          {/* --- Upload View --- */}
          <UploadView
            file={file}
            videoUrl={videoUrl}
            targetLang={targetLang}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            onFileUpload={handleFileUpload}
            onUrlChange={handleUrlChange}
            onLanguageChange={handleLanguageChange}
            onStart={startProcessing}
            title={title}
            setTitle={setTitle}
            // isReady={isReady}
          />

          {/* Tools */}
          {/* <div>
            <Tools />
          </div> */}

          {/* Summary part */}
          <div>
            <SummaryNew />
          </div>

          <div>
            <hr className="border-2 mt-2" />
            <Contact />
          </div>
        </div>
      </div>
    </>
  );
}
