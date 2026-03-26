"use client";

import { useState } from "react";
import { UploadView } from "../../components/UploadView";
import { useApp } from "../../context/AppContext";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const { file, setFile, targetLang, setTargetLang, videoUrl, setVideoUrl } =
    useApp();
  const router = useRouter();

  const [isReady, setIsReady] = useState(false);

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
      isReady={isReady}
      toggleTheme={() => {}}
      onFileUpload={async (e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setIsReady(false)

        setFile(selectedFile);

        const previewUrl = URL.createObjectURL(selectedFile);
        setVideoUrl(previewUrl);

        try {
          const duration = await getVideoDuration(selectedFile);

          console.log("Video duration (seconds):", duration);

          // ✅ SAVE HERE
          localStorage.setItem("videoDuration", duration.toString());
        } catch (err) {
          console.error("Duration error:", err);
        }
      }}
      onUrlChange={(e) => setVideoUrl(e.target.value)}
      onLanguageChange={(e) => {
        const lang = e.target.value;
        console.log("Selected:", lang);
        setTargetLang(lang);
      }}
      onStart={() => {
        console.log("Sending:", targetLang);
        localStorage.setItem("targetLang", targetLang);
        router.push("/processing");
      }}
      
    />
  );
}
