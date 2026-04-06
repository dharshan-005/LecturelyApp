"use client";

import { useState } from "react";
import { UploadView } from "../../components/UploadView";
import { useApp } from "../../context/AppContext";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const { file, setFile, targetLang, setTargetLang, videoUrl, setVideoUrl } =
    useApp();
  const router = useRouter();

  // const [isReady, setIsReady] = useState(false);
  const [title, setTitle] = useState("");

  // const [selectedLang, setSelectedLang] = useState(targetLang);
  console.log("Current targetLang:", targetLang);

  const getVideoDuration = (file: File): Promise<number> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        resolve(video.duration); // ✅ seconds
      };

      video.onerror = () => reject("Failed to load metadata");

      video.src = URL.createObjectURL(file);
    });
  };

  return (
    <UploadView
      file={file}
      videoUrl={videoUrl}
      targetLang={targetLang}
      isDarkMode={false}
      // isReady={isReady}
      toggleTheme={() => {}}
      title={title}
      setTitle={setTitle}
      onFileUpload={async (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // setIsReady(false);

        setFile(selectedFile);

        const previewUrl = URL.createObjectURL(selectedFile);
        setVideoUrl(previewUrl);

        try {
          const duration = await getVideoDuration(selectedFile);

          console.log("Video duration (seconds):", duration);

          // ✅ SAVE HERE
          localStorage.setItem("videoDuration", duration.toString());
          // setIsReady(true);
        } catch (err) {
          console.error("Duration error:", err);
        }
      }}
      onUrlChange={(e) => {
        const url = e.target.value;
        setVideoUrl(url);
        // setIsReady(!!url.trim());
      }}
      onLanguageChange={(e) => {
        const lang = e.target.value;
        console.log("Selected:", lang);
        setTargetLang(lang);
      }}
      onStart={async () => {
        const finalTitle = title.trim() || "Untitled Lecture";

        const duration = Number(localStorage.getItem("videoDuration")) || 0;

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lectures`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${/* your token */ ""}`,
            },
            body: JSON.stringify({
              title: finalTitle,
              duration,
              videoUrl,
              targetLang,
            }),
          });

          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message);
          }

          router.push(`/editor/${data.lecture._id}`);
        } catch (err) {
          console.error("Create lecture error:", err);
        }
      }}
    />
  );
}
