"use client";

import { createContext, use, useContext, useEffect, useLayoutEffect, useState } from "react";

type AppContextType = {
  file: File | null;
  setFile: (f: File | null) => void;

  subtitles: any[];
  setSubtitles: React.Dispatch<React.SetStateAction<any[]>>;

  targetLang: string;
  setTargetLang: (lang: string) => void;

  isDarkMode: boolean;
  toggleTheme: () => void;

  transcriptText: string;
  setTranscriptText: (t: string) => void;

  videoUrl: string | null;
  setVideoUrl: (url: string | null) => void;

  hydrated: boolean;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [file, setFile] = useState<File | null>(null);
  const [subtitles, setSubtitles] = useState<any[]>([]);
  const [targetLang, setTargetLang] = useState("Tamil");

  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleTheme = () => setIsDarkMode((p) => !p);

  const [transcriptText, setTranscriptText] = useState("");

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useLayoutEffect(() => {
    console.log("restoring from local")
    const storedVideoUrl = localStorage.getItem("videoUrl");
    const storedSubs = localStorage.getItem("subtitles");

    if (storedVideoUrl) setVideoUrl(storedVideoUrl);
    if (storedSubs) setSubtitles(JSON.parse(storedSubs));

    setHydrated(true);
    console.log("Hydration done")
  }, []);

  useEffect(() => {
    if (videoUrl) {
      localStorage.setItem("videoUrl", videoUrl);
    }
  }, [videoUrl]);

  useEffect(() => {
    if (subtitles.length) {
      localStorage.setItem("subtitles", JSON.stringify(subtitles));
    }
  }, [subtitles]);

  return (
    <AppContext.Provider
      value={{
        file,
        setFile,
        subtitles,
        setSubtitles,
        targetLang,
        setTargetLang,
        isDarkMode,
        toggleTheme,
        transcriptText,
        setTranscriptText,
        videoUrl,
        setVideoUrl,
        hydrated
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be inside AppProvider");
  return ctx;
}
