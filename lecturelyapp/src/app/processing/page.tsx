"use client";

import { useEffect, useRef, useState } from "react";
import { ProcessingView } from "../../components/ProcessingView";
import { useApp } from "../../context/AppContext";
import { useRouter } from "next/navigation";
import { parseSRT } from "../../utils/parseSRT";

export default function ProcessingPage() {
  const { file, setSubtitles, setVideoUrl } = useApp();
  const router = useRouter();
  const [progress, setProgress] = useState(30);
  const [stage, setStage] = useState("Uploading video...");

  const hasRun = useRef(false);

  useEffect(() => {
    if (!file) {
      // router.push("/upload");
      console.warn("No file in context!!");
      return;
    }

    if (hasRun.current) return;
    hasRun.current = true;

    const run = async () => {
      try {
        setSubtitles([]);
        setStage("Processing video with AI...");

        const formData = new FormData();
        formData.append("video", file);

        const res = await fetch("http://localhost:5000/api/generate-subtitle", {
          method: "POST",
          body: formData,
        });

        // const srtText = await res.text();
        // setSubtitles(parseSRT(srtText));
        // console.log("Generated SRT:", srtText);
        const response = await res.json();

        if (!res.ok) {
          throw new Error("Server error");
        }

        setVideoUrl(`http://localhost:5000/uploads/${response.video}`);
        setSubtitles(response.subtitles || []);

        router.push("/editor");
      } catch (error) {
        alert("Processing failed");
        router.push("/upload");
      }
    };

    run();
  }, [file]);

  return <ProcessingView progress={progress} stage={stage} />;
}
