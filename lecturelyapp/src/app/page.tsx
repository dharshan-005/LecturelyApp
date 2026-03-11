"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
// import { Subtitle, AppView } from "../types";
import { UploadView } from "../components/UploadView";
// import { ProcessingView } from "../components/ProcessingView";
// import { EditorView } from "../components/EditorView";
import { Navbar } from "@/components/Navbar";
import Contact from "@/components/Contact";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useApp } from "@/context/AppContext";
import Tools from "@/components/Tools";
import SummaryNew from "@/components/SummaryNew";

export default function LecturelyApp() {
  const { file, setFile, transcriptText, videoUrl, setVideoUrl } = useApp();

  // --- Theme State ---
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const { targetLang, setTargetLang } = useApp();

  // --- Handlers ---
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTargetLang(e.target.value);
  };

  const handleUrlChange = (e: ChangeEvent<HTMLInputElement>) => {
    setVideoUrl(e.target.value);
  };

  // Theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);

      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const startProcessing = () => {
    if (!file && !videoUrl) {
      alert("Please upload a video or provide a URL.");
      return;
    }

    router.push("/processing");
  };

  const router = useRouter();

  return (
    <>
      <div>
        <div className="from-indigo-50 to-white dark:from-slate-950 dark:to-slate-900 bg-linear-to-br text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
          <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

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
          />

          {/* Tools */}
          <div>
            <Tools />
          </div>

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
      {/* </div> */}
    </>
  );
}
