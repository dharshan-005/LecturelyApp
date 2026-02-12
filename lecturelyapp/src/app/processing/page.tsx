"use client";

import { useEffect, useState } from "react";
import { ProcessingView } from "../../components/ProcessingView";
import { useApp } from "../../context/AppContext";
import { useRouter } from "next/navigation";
import { parseSRT } from "../../utils/parseSRT";

export default function ProcessingPage() {
  const { file, setSubtitles } = useApp();
  const router = useRouter();
  const [progress, setProgress] = useState(30);
  const [stage, setStage] = useState("Uploading video...");

  useEffect(() => {
    if (!file) {
      // router.push("/upload");
      console.warn("No file in context!!")
      return;
    }

    const run = async () => {
      try {
        setStage("Processing video with AI...");

        const formData = new FormData();
        formData.append("video", file);

        const res = await fetch("http://localhost:5000/api/subtitle", {
          method: "POST",
          body: formData,
        });

        const srtText = await res.text();
        setSubtitles(parseSRT(srtText));

        router.push("/editor");
      } catch {
        alert("Processing failed");
        router.push("/upload");
      }
    };

    run();
  }, []);

  return <ProcessingView progress={progress} stage={stage} />;
}