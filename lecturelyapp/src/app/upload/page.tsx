"use client";

import { UploadView } from "../../components/UploadView";
import { useApp } from "../../context/AppContext";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const { file, setFile, targetLang, setTargetLang, videoUrl, setVideoUrl } = useApp();
  const router = useRouter();

  return (
    <UploadView
      file={file}
      targetLang={targetLang}
      isDarkMode={false}
      toggleTheme={() => {}}
      onFileUpload={(e) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        setFile(selectedFile);

        const url = URL.createObjectURL(selectedFile);
        setVideoUrl(url);
        // if (e.target.files?.[0]) setFile(e.target.files[0]);
      }}
      onLanguageChange={(e) => setTargetLang(e.target.value)}
      onStart={() => router.push("/processing")}
    />
  );
}