"use client";

import { useEffect, useRef, useState } from "react";
import { EditorView } from "../../../components/EditorView";
import { useApp } from "../../../context/AppContext";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toSRT, toVTT, toTXT, toJSON } from "@/utils/subtitleExport";
// import Chatbot from "@/components/chat/Chatbot";

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
    setIsFromBackend,
  } = useApp();

  console.log("Editor subtitles:", subtitles);

  const router = useRouter();

  const [keyPoints, setKeyPoints] = useState<string[]>([]);
  const [concepts, setConcepts] = useState<string[]>([]);

  const [summary, setSummary] = useState("");
  // const [loadingSummary, setLoadingSummary] = useState(false);

  const params = useParams();

  const lectureId =
    typeof params?.lectureId === "string"
      ? params.lectureId
      : Array.isArray(params?.lectureId)
        ? params.lectureId[0]
        : null;
  console.log("LECTURE ID:", lectureId);

  const { data: session } = useSession();

  const hasLoadedLecture = useRef(false);

  console.log({ hydrated, videoUrl, subtitlesLength: subtitles.length });
  console.log("VIDEO URL:", videoUrl);

  const transcript = subtitles.map((s) => s.original).join(" ");
  console.log("TRANSCRIPT:", transcript);

  // const fetchSummary = async () => {
  //   if (!subtitles.length) return;

  //   setLoadingSummary(true);

  //   const transcript = subtitles.map((s) => s.original).join(" ");

  //   const res = await fetch("/api/summarize", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       text: transcript,
  //       language: "English",
  //       length: "medium",
  //       format: "bullet",
  //     }),
  //   });

  //   if (!res.ok) {
  //     console.error("Summary API failed");
  //     return;
  //   }

  //   const data = await res.json();

  //   setSummary(data.summary);
  //   setLoadingSummary(false);
  // };

  useEffect(() => {
    if (hasLoadedLecture.current) return; // 🚨 BLOCK override

    if (!videoUrl) {
      const savedVideo = localStorage.getItem("lecturely_video");

      if (!videoUrl && savedVideo) {
        setVideoUrl(savedVideo);
      }
    }
  }, [videoUrl]);

  useEffect(() => {
    if (hydrated && !videoUrl && !lectureId) {
      router.push("/upload");
    }
  }, [hydrated, videoUrl, router]);

  const summaryGenerated = useRef(false);

  // useEffect(() => {
  //   if (subtitles.length === 0) return;
  //   if (summaryGenerated.current) return;

  //   summaryGenerated.current = true;

  //   fetchSummary();
  // }, [subtitles]);

  useEffect(() => {
    console.log("Fetching lecture...");
    if (!lectureId || lectureId === "[lectureId]" || !session) return;

    const fetchLecture = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/lectures/${lectureId}`,
          {
            headers: {
              Authorization: `Bearer ${session.user.email}`,
            },
          },
        );

        console.log("SESSION:", session);

        if (!res.ok) {
          console.error("API failed:", await res.text());
          return;
        }

        const data = await res.json();
        console.log("Lecture data:", data);

        if (!data?.subtitles) {
          console.error("Invalid lecture data:", data);
          return;
        }

        const formattedSubtitles = data.subtitles.map(
          (s: any, index: number) => ({
            id: index,
            start: s.start,
            end: s.end,
            original: s.text,
            translated: data.translatedSubtitles?.[index]?.text || "",
          }),
        );

        setSubtitles(formattedSubtitles);
        setIsFromBackend(true);

        // ✅ NEW — notes
        setSummary(data.notes?.summary || "");
        setKeyPoints(data.notes?.keyPoints || []);
        setConcepts(data.notes?.importantConcepts || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchLecture();
  }, [lectureId, session]);

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
        onDownload={(format, mode) => {
          if (!subtitles.length) return;

          let content = "";

          switch (format) {
            case "srt":
              content = toSRT(subtitles, mode);
              break;
            case "vtt":
              content = toVTT(subtitles, mode);
              break;
            case "txt":
              content = toTXT(subtitles, mode);
              break;
            case "json":
              content = toJSON(subtitles, mode);
              break;
          }

          // if (format === "srt") {
          //   content = toSRT(subtitles, mode);
          // } else {
          //   content = toVTT(subtitles, mode);
          // }

          const mimeTypes = {
            srt: "text/plain",
            vtt: "text/vtt",
            txt: "text/plain",
            json: "application/json",
          };

          const blob = new Blob([content], { type: mimeTypes[format] });
          
          // const blob = new Blob([content], { type: "text/plain" });
          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");
          a.href = url;
          a.download = `subtitles.${format}`;
          a.click();

          URL.revokeObjectURL(url);
        }}
        onNewProject={() => router.push("/")}
        summary={summary}
        // loadingSummary={loadingSummary}
        keyPoints={keyPoints}
        concepts={concepts}
      />
      {/* <Chatbot context={transcript} /> */}
    </>
  );
}
