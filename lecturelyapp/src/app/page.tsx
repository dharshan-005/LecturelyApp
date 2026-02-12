"use client";

import React, { useState, ChangeEvent } from "react";
// import { Subtitle, AppView } from "../types";
import { UploadView } from "../components/UploadView";
// import { ProcessingView } from "../components/ProcessingView";
// import { EditorView } from "../components/EditorView";
import { Navbar } from "@/components/Navbar";
import Contact from "@/components/Contact";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useApp } from "@/context/AppContext";
import Summary from "@/components/Summary";
import Tabs from "@/components/Tabs";
import LectureSummary from "@/components/LectureSummary";

export default function LecturelyApp() {
  const { file, setFile, transcriptText } = useApp();

  // --- Theme State ---
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const [targetLang, setTargetLang] = useState<string>("Tamil");

  // --- Handlers ---
  const toggleTheme = () => setIsDarkMode(!isDarkMode); // <--- Toggle Handler

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTargetLang(e.target.value);
  };

  const startProcessing = () => {
    if (!file) {
      alert("Please upload a video first");
      return;
    }

    router.push("/processing");
  };

  const router = useRouter();

  return (
    <>
      <div className={isDarkMode ? "dark" : ""}>
        <div className="from-indigo-50 to-white dark:from-slate-950 dark:to-slate-900 bg-linear-to-br text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
          <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

          {/* --- Upload View --- */}
          <UploadView
            file={file}
            targetLang={targetLang}
            isDarkMode={isDarkMode}
            toggleTheme={toggleTheme}
            onFileUpload={handleFileUpload}
            onLanguageChange={handleLanguageChange}
            onStart={startProcessing}
          />

          {/* Tabs */}
          <div>
            {/* <Tabs /> */}
          </div>

          {/* Summary part */}
          <div>
            <Summary />
            <LectureSummary />
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
