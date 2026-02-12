"use client";

import { useEffect } from "react";
import { EditorView } from "../../components/EditorView";
import { useApp } from "../../context/AppContext";
import { useRouter } from "next/navigation";

export default function EditorPage() {
  const {
    subtitles,
    setSubtitles,
    targetLang,
    toggleTheme,
    isDarkMode,
    videoUrl,
    hydrated,
  } = useApp();

  const router = useRouter();

  useEffect(() => {
    if (hydrated && !videoUrl) {
      router.push("/upload");
    }
  }, [hydrated, videoUrl, router]);

  if (!hydrated) return null;
  if (!videoUrl) return null;

  console.log({ hydrated, videoUrl, subtitlesLength: subtitles.length });

  return (
    <EditorView
      subtitles={subtitles}
      targetLang={targetLang}
      isDarkMode={isDarkMode}
      toggleTheme={toggleTheme}
      videoSrc={videoUrl}
      onSubtitleChange={(id, text) =>
        setSubtitles((prev) =>
          prev.map((s) => (s.id === id ? { ...s, translated: text } : s))
        )
      }
      onDownload={() => alert("SRT already generated")}
      onNewProject={() => router.push("/upload")}
    />
  );
}
