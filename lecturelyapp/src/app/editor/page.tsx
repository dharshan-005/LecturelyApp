"use client";

import { useEffect, useRef, useState } from "react";
import { EditorView } from "../../components/EditorView";
import { useApp } from "../../context/AppContext";
import { useRouter } from "next/navigation";
import Chatbot from "@/components/chat/Chatbot";

export default function EditorPage() {
  const {
    subtitles,
    setSubtitles,
    targetLang,
    toggleTheme,
    isDarkMode,
    videoUrl,
    setVideoUrl,
    hydrated,
  } = useApp();

  console.log("Editor subtitles:", subtitles);

  const router = useRouter();

  const [summary, setSummary] = useState("");
  const [loadingSummary, setLoadingSummary] = useState(false);

  console.log({ hydrated, videoUrl, subtitlesLength: subtitles.length });
  console.log("VIDEO URL:", videoUrl);

  const transcript = subtitles.map((s) => s.original).join(" ");
  console.log("TRANSCRIPT:", transcript);

  const fetchSummary = async () => {
    if (!subtitles.length) return;

    setLoadingSummary(true);

    const transcript = subtitles.map((s) => s.original).join(" ");

    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: transcript,
        language: "English",
        length: "medium",
        format: "bullet",
      }),
    });

    if (!res.ok) {
      console.error("Summary API failed");
      return;
    }

    const data = await res.json();

    setSummary(data.summary);
    setLoadingSummary(false);
  };

  useEffect(() => {
    if (!videoUrl) {
      const savedVideo = localStorage.getItem("lecturely_video");

      if (!videoUrl && savedVideo) {
        setVideoUrl(savedVideo);
      }
      console.log("Restoring video from storage:", savedVideo);
    }
  }, [videoUrl, setVideoUrl]);

  useEffect(() => {
    if (hydrated && !videoUrl) {
      router.push("/upload");
    }
  }, [hydrated, videoUrl, router]);

  const summaryGenerated = useRef(false);

  useEffect(() => {
    if (subtitles.length === 0) return;
    if (summaryGenerated.current) return;

    summaryGenerated.current = true;

    fetchSummary();
  }, [subtitles]);

  // useEffect(() => {
  //   if (subtitles.length > 0) {
  //     fetchSummary();
  //   }
  // }, [subtitles]);

  if (!hydrated) return null;
  if (!videoUrl) return null;

  return (
    <>
      <EditorView
        subtitles={subtitles}
        targetLang={targetLang}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        videoSrc={videoUrl}
        onSubtitleChange={(id, text) =>
          setSubtitles((prev) =>
            prev.map((s) => (s.id === id ? { ...s, translated: text } : s)),
          )
        }
        onDownload={() => {
          if (!subtitles.length) return;

          function secondsToSRT(seconds: number) {
            const date = new Date(seconds * 1000);
            const hh = String(date.getUTCHours()).padStart(2, "0");
            const mm = String(date.getUTCMinutes()).padStart(2, "0");
            const ss = String(date.getUTCSeconds()).padStart(2, "0");
            const ms = String(date.getUTCMilliseconds()).padStart(3, "0");

            return `${hh}:${mm}:${ss},${ms}`;
          }

          const srtContent = subtitles
            .map((sub, index) => {
              return `${index + 1} 
            ${secondsToSRT(sub.start)} --> ${secondsToSRT(sub.end)} 
            ${sub.translated.trim() ? sub.translated : sub.original}
            `;
            })
            .join("\n");

          const blob = new Blob([srtContent], { type: "text/plain" });
          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = "subtitles.srt";
          a.click();

          URL.revokeObjectURL(url);
        }}
        onNewProject={() => router.push("/")}
        summary={summary}
        loadingSummary={loadingSummary}
      />
      <Chatbot context={transcript} />
    </>
  );
}
