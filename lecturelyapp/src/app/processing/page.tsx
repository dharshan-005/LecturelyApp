"use client";

import { useEffect, useRef, useState } from "react";
import { ProcessingView } from "../../components/ProcessingView";
import { useApp } from "../../context/AppContext";
import { useRouter, useSearchParams } from "next/navigation";
import { parseSRT } from "../../utils/parseSRT";
import { useSession } from "next-auth/react";

export default function ProcessingPage() {
  const { file, videoUrl, setSubtitles, setVideoUrl } = useApp();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Uploading video...");

  const searchParams = useSearchParams();
  const storedLang =
    typeof window !== "undefined" ? localStorage.getItem("targetLang") : null;

  const targetLang = storedLang || searchParams?.get("lang") || "ta";

  const { data: session } = useSession();

  const hasRun = useRef(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev; // stop at 90%
        return prev + 5;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!file && !videoUrl) {
      // router.push("/upload");
      console.warn("No file or URL in context!!");
      return;
    }

    if (hasRun.current) return;
    hasRun.current = true;

    const run = async () => {
      try {
        function srtToSeconds(time: string): number {
          const [hms, ms] = time.split(",");
          const [h, m, s] = hms.split(":").map(Number);
          return h * 3600 + m * 60 + s + Number(ms) / 1000;
        }

        function normalizeSubtitles(raw: any[]) {
          return raw.map((item, index) => {
            // Case 1: SRT string timestamps (your 5000 backend)
            if (typeof item.start === "string") {
              return {
                id: item.id ?? index,
                start: srtToSeconds(item.start),
                end: srtToSeconds(item.end),
                original: item.original ?? item.text ?? "",
                translated: item.translated ?? "",
              };
            }

            // Case 2: numeric timestamps (future-safe)
            if (typeof item.start === "number") {
              return {
                id: item.id ?? index,
                start: item.start,
                end: item.end,
                original: item.original ?? item.text ?? "",
                translated: item.translated ?? "",
              };
            }

            throw new Error("Unknown subtitle format from backend");
          });
        }

        function normalizeSubtitlesFromUrl(data: any) {
          const { original, translated } = data;

          if (!Array.isArray(original) || !Array.isArray(translated)) {
            throw new Error("Invalid URL subtitle format");
          }

          return original.map((item: any, index: number) => {
            const translatedItem = translated[index];

            // Handle numeric timestamps
            if (typeof item.start === "number") {
              return {
                id: index,
                start: item.start,
                end: item.end,
                original: item.text ?? item.original ?? "",
                translated:
                  translatedItem?.text ?? translatedItem?.translated ?? "",
              };
            }

            // Handle SRT timestamps
            if (typeof item.start === "string") {
              return {
                id: index,
                start: srtToSeconds(item.start),
                end: srtToSeconds(item.end),
                original: item.original ?? item.text ?? "",
                translated:
                  translatedItem?.translated ?? translatedItem?.text ?? "",
              };
            }

            throw new Error("Unknown URL subtitle format");
          });
        }

        console.log("Creating lecture in DB...");
        const storedDuration = localStorage.getItem("videoDuration");
        console.log("Stored Duration:", storedDuration);

        console.log("EMAIL SENT:", localStorage.getItem("email"));
        console.log(
          "FULL AUTH HEADER:",
          `Bearer ${localStorage.getItem("email")}`,
        );

        const lectureRes = await fetch("http://localhost:5000/api/lectures", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.email}`,
          },
          body: JSON.stringify({
            title: file?.name || videoUrl || "Untitled Lecture",
            duration: storedDuration ? Number(storedDuration) : 0,
          }),
        });

        const lectureData = await lectureRes.json();

        console.log("EMAIL FROM SESSION:", session?.user?.email);
        console.log("Lecture response:", lectureData);

        if (!lectureRes.ok) {
          throw new Error(lectureData.message || "Lecture creation failed");
        }

        // store lectureId for later use
        localStorage.setItem("lectureId", lectureData.lecture._id);

        setSubtitles([]);
        setStage("Processing video with AI...");

        let responseData;

        if (file) {
          const formData = new FormData();
          formData.append("video", file);
          formData.append("target_lang", targetLang);

          console.log("Sending language to backend:", targetLang);

          const res = await fetch(
            "http://localhost:5000/api/generate-subtitle",
            {
              method: "POST",
              body: formData,
            },
          );

          if (!res.ok) {
            throw new Error("Upload failed");
          }

          responseData = await res.json();
          console.log(
            "FILE BACKEND RESPONSE FULL:",
            JSON.stringify(responseData, null, 2),
          );

          const videoPath = `http://localhost:5000/uploads/${responseData.video}`;

          setVideoUrl(videoPath);
          localStorage.setItem("lecturely_video", videoPath);
          console.log("VIDEO PATH:", videoPath);
          // setVideoUrl(`http://localhost:5000/uploads/${responseData.video}`);
          // setVideoUrl(URL.createObjectURL(file));
        } else if (videoUrl) {
          const res = await fetch(
            `http://127.0.0.1:8000/generate-from-url?url=${encodeURIComponent(
              videoUrl,
            )}&target_lang=${targetLang}`,
            {
              method: "POST",
            },
          );

          if (!res.ok) {
            throw new Error("URL processing failed");
          }

          responseData = await res.json();
          console.log("URL BACKEND RESPONSE:", responseData);

          setVideoUrl(`http://127.0.0.1:8000${responseData.video}`);
        }

        // setVideoUrl(`http://localhost:5000/uploads/${response.video}`);
        // setSubtitles(responseData.original || responseData.subtitles || []);

        let normalized;

        if (responseData.subtitles) {
          normalized = normalizeSubtitles(responseData.subtitles);
        } else if (responseData.original && responseData.translated) {
          normalized = normalizeSubtitlesFromUrl(responseData);
        } else {
          throw new Error("Unsupported backend response structure");
        }

        // const rawSubs = responseData.original || responseData.subtitles || [];
        // const normalized = normalizeSubtitles(rawSubs);
        setSubtitles(normalized);

        setStage("Finalizing...");
        setProgress(100);

        router.push("/editor");
      } catch (error) {
        console.error("Processing Error:", error);
        alert("Processing failed");
        router.push("/");
      }
    };

    run();
  }, [file, videoUrl, targetLang]);

  return <ProcessingView progress={progress} stage={stage} />;
}
