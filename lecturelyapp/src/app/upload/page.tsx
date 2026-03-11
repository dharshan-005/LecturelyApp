"use client";

import { useState } from "react";
import { UploadView } from "../../components/UploadView";
import { useApp } from "../../context/AppContext";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const { file, setFile, targetLang, setTargetLang, videoUrl, setVideoUrl } =
    useApp();
  const router = useRouter();

  // const [selectedLang, setSelectedLang] = useState(targetLang);
  console.log("Current targetLang:", targetLang);

  return (
    <UploadView
      file={file}
      videoUrl={videoUrl}
      targetLang={targetLang}
      isDarkMode={false}
      toggleTheme={() => {}}
      onFileUpload={(e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        // const url = URL.createObjectURL(selectedFile);
        // setVideoUrl(url);
        const previewUrl = URL.createObjectURL(selectedFile)
        setVideoUrl(previewUrl);
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
