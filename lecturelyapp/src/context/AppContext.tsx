"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

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

  isFromBackend: boolean;
  setIsFromBackend: (v: boolean) => void;

  title: string;
  setTitle: (title: string) => void;
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [file, setFile] = useState<File | null>(null);
  const [subtitles, setSubtitles] = useState<any[]>([]);
  const [targetLang, setTargetLang] = useState("ta");

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [transcriptText, setTranscriptText] = useState("");

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const [isFromBackend, setIsFromBackend] = useState(false);

  const [title, setTitle] = useState("");
  // const [title, setTitle] = useState(() => {
  //   if (typeof window !== "undefined") {
  //     return localStorage.getItem("title") || "Lecture";
  //   }
  //   return "";
  // });

  useLayoutEffect(() => {
    if (isFromBackend) return; // 🚨 STOP override

    const storedVideoUrl = localStorage.getItem("videoUrl");
    // const storedSubs = localStorage.getItem("subtitles");
    const storedLang = localStorage.getItem("targetLang");

    if (storedVideoUrl) setVideoUrl(storedVideoUrl);
    // if (storedSubs) setSubtitles(JSON.parse(storedSubs));
    if (storedLang) setTargetLang(storedLang);

    setHydrated(true);
  }, [isFromBackend]);

  useEffect(() => {
    const storedTitle = localStorage.getItem("title");
    if (storedTitle) {
      setTitle(storedTitle);
    }
  }, []);

  useEffect(() => {
    if (videoUrl) {
      localStorage.setItem("videoUrl", videoUrl);
    }
  }, [videoUrl]);

  // useEffect(() => {
  //   if (isFromBackend) return; // 🚨 don't overwrite backend data

  //   if (subtitles.length) {
  //     localStorage.setItem("subtitles", JSON.stringify(subtitles));
  //   }
  // }, [subtitles, isFromBackend]);

  useEffect(() => {
    localStorage.setItem("targetLang", targetLang);
  }, [targetLang]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      setIsDarkMode(true);
    }
  }, []);

  // Sync HTML class whenever theme changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  // Toggle function (must be OUTSIDE useEffect)
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  // useEffect(() => {
  //   const storedTitle = localStorage.getItem("title");
  //   if (storedTitle) setTitle(storedTitle);
  // }, []);

  useEffect(() => {
    localStorage.setItem("title", title);
  }, [title]);

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
        hydrated,
        isFromBackend,
        setIsFromBackend,
        title,
        setTitle,
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
