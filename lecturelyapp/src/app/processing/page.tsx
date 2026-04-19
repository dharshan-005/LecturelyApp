"use client";

import { useEffect, useRef, useState } from "react";
import { ProcessingView } from "../../components/ProcessingView";
import { useApp } from "../../context/AppContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function ProcessingPage() {
  const { file, videoUrl, title } = useApp(); // 🔥 include file
  const router = useRouter();
  const { data: session } = useSession();

  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState("Starting...");

  const hasRun = useRef(false);

  const storedLang =
    typeof window !== "undefined" ? localStorage.getItem("targetLang") : null;

  const targetLang = storedLang || "ta";

  useEffect(() => {
    if (!file && !videoUrl) {
      console.warn("No file or URL");
      return;
    }

    if (!session?.user?.email) {
      console.warn("No session");
      return;
    }

    if (hasRun.current) return;
    hasRun.current = true;

    const startProcessing = async () => {
      try {
        const cleanTitle = title?.trim() || "Untitled Lecture";
        const storedDuration = localStorage.getItem("videoDuration");

        setStage("Preparing video...");
        setProgress(5);

        let finalVideoUrl = videoUrl;

        // 🎥 STEP 1 — HANDLE FILE UPLOAD
        if (file) {
          setStage("Uploading video...");

          const formData = new FormData();
          formData.append("video", file);

          const uploadRes = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/generate-subtitle`,
            {
              method: "POST",
              body: formData,
            },
          );

          const uploadData = await uploadRes.json();

          if (!uploadRes.ok) {
            throw new Error(uploadData.message || "Upload failed");
          }

          const baseUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

          finalVideoUrl = `${baseUrl}/uploads/${uploadData.video}`;
        }

        // 🚀 STEP 2 — START BACKEND JOB
        setStage("Starting AI processing...");
        setProgress(10);

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/lectures`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${session.user.email}`,
            },
            body: JSON.stringify({
              title: cleanTitle,
              duration: storedDuration ? Number(storedDuration) : 0,
              videoUrl: finalVideoUrl, // ✅ FIXED
              targetLang,
            }),
          },
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to start processing");
        }

        const lectureId = data.lectureId;

        localStorage.setItem("lectureId", lectureId);

        // 🔁 STEP 3 — POLL PROGRESS
        pollProgress(lectureId);
      } catch (error) {
        console.error("Start Processing Error:", error);
        alert("Failed to start processing");
        router.push("/");
      }
    };

    const pollProgress = (lectureId: string) => {
      const interval = setInterval(async () => {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/lectures/progress/${lectureId}`,
            {
              headers: {
                Authorization: `Bearer ${session?.user?.email}`,
              },
            },
          );

          const data = await res.json();

          if (!res.ok) {
            throw new Error("Failed to fetch progress");
          }

          setProgress(data.progress);
          setStage(data.stage);

          if (data.status === "completed") {
            clearInterval(interval);
            router.push(`/editor/${lectureId}`);
          }

          if (data.status === "failed") {
            clearInterval(interval);
            alert("Processing failed");
            router.push("/");
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 3000);
    };

    startProcessing();
  }, [file, videoUrl, session, title]);

  return <ProcessingView progress={progress} stage={stage} />;
}

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { ProcessingView } from "../../components/ProcessingView";
// import { useApp } from "../../context/AppContext";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";

// export default function ProcessingPage() {
//   const { file, videoUrl, setSubtitles, setVideoUrl, title } = useApp();
//   const router = useRouter();

//   const [progress, setProgress] = useState(0);
//   const [stage, setStage] = useState("Uploading video...");

//   const storedLang =
//     typeof window !== "undefined" ? localStorage.getItem("targetLang") : null;

//   const targetLang = storedLang || "ta";

//   const { data: session } = useSession();

//   const hasRun = useRef(false);

//   // Progress animation
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setProgress((prev) => (prev >= 90 ? prev : prev + 5));
//     }, 500);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     if (!file && !videoUrl) {
//       console.warn("No file or URL!");
//       return;
//     }

//     if (hasRun.current) return;
//     hasRun.current = true;

//     const run = async () => {
//       try {
//         console.log("Creating lecture in DB...");

//         // ✅ SIMPLE TITLE LOGIC
//         const cleanTitle =
//           title?.trim() ||
//           file?.name?.replace(/\.[^/.]+$/, "") ||
//           "Untitled Lecture";

//         console.log("FINAL TITLE USED:", cleanTitle);

//         const storedDuration = localStorage.getItem("videoDuration");

//         setSubtitles([]);
//         setStage("Processing video with AI...");

//         let responseData: any;
//         let videoPath = "";

//         // 🎥 FILE UPLOAD
//         if (file) {
//           const formData = new FormData();
//           formData.append("video", file);
//           formData.append("target_lang", targetLang);

//           const res = await fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/api/generate-subtitle`,
//             {
//               method: "POST",
//               body: formData,
//             },
//           );

//           if (!res.ok) {
//             const err = await res.json();
//             throw new Error(err.message || "Upload failed");
//           }

//           responseData = await res.json();

//           const baseUrl =
//             process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

//           videoPath = `${baseUrl}/uploads/${responseData.video}`;

//           setVideoUrl(videoPath);
//         }

//         // 🌐 URL UPLOAD
//         else if (videoUrl) {
//           const res = await fetch(
//             `http://127.0.0.1:8000/generate-from-url?url=${encodeURIComponent(
//               videoUrl,
//             )}&target_lang=${targetLang}`,
//             {
//               method: "POST",
//             },
//           );

//           if (!res.ok) {
//             throw new Error("URL processing failed");
//           }

//           responseData = await res.json();
//           videoPath = `http://127.0.0.1:8000${responseData.video}`;

//           setVideoUrl(videoPath);
//         }

//         // 🧠 Normalize subtitles
//         const normalized = (responseData.subtitles || []).map(
//           (item: any, index: number) => ({
//             id: index,
//             start: item.start,
//             end: item.end,
//             original: item.original || item.text || "",
//             translated: item.translated || "",
//           }),
//         );

//         setSubtitles(normalized);

//         const email = session?.user?.email;

//         if (!email) {
//           console.error("No session email");
//           return;
//         }

//         // 🚀 CREATE LECTURE
//         const lectureRes = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/lectures`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${email}`,
//             },
//             body: JSON.stringify({
//               title: cleanTitle,
//               duration: storedDuration ? Number(storedDuration) : 0,
//               videoUrl: videoPath,

//               subtitles: normalized.map((s: any) => ({
//                 start: s.start,
//                 end: s.end,
//                 text: s.original,
//               })),

//               translatedSubtitles: normalized.map((s: any) => ({
//                 start: s.start,
//                 end: s.end,
//                 text: s.translated,
//               })),

//               notes: responseData.notes || {
//                 summary: "",
//                 keyPoints: [],
//                 importantConcepts: [],
//               },
//             }),
//           },
//         );

//         const lectureData = await lectureRes.json();

//         if (!lectureRes.ok) {
//           throw new Error(lectureData.message || "Lecture creation failed");
//         }

//         localStorage.setItem("lectureId", lectureData.lecture._id);

//         setStage("Finalizing...");
//         setProgress(100);

//         router.push(`/editor/${lectureData.lecture._id}`);
//       } catch (error) {
//         console.error("Processing Error:", error);
//         alert("Processing failed");
//         router.push("/");
//       }
//     };

//     run();
//   }, [file, videoUrl, targetLang, session]);

//   return <ProcessingView progress={progress} stage={stage} />;
// }

// "use client";

// import { useEffect, useRef, useState } from "react";
// import { ProcessingView } from "../../components/ProcessingView";
// import { useApp } from "../../context/AppContext";
// import { useRouter, useSearchParams } from "next/navigation";
// import { parseSRT } from "../../utils/parseSRT";
// import { useSession } from "next-auth/react";

// export default function ProcessingPage() {
//   const { file, videoUrl, setSubtitles, setVideoUrl, title } = useApp();
//   const router = useRouter();
//   const [progress, setProgress] = useState(0);
//   const [stage, setStage] = useState("Uploading video...");

//   const searchParams = useSearchParams();
//   const storedLang =
//     typeof window !== "undefined" ? localStorage.getItem("targetLang") : null;

//   const targetLang = storedLang || searchParams?.get("lang") || "ta";

//   const { data: session } = useSession();

//   const hasRun = useRef(false);

//   useEffect(() => {
//     let interval: NodeJS.Timeout;

//     interval = setInterval(() => {
//       setProgress((prev) => {
//         if (prev >= 90) return prev; // stop at 90%
//         return prev + 5;
//       });
//     }, 500);

//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     if (!file && !videoUrl) {
//       // router.push("/upload");
//       console.warn("No file or URL in context!!");
//       return;
//     }

//     const run = async () => {
//       try {
//         function srtToSeconds(time: string): number {
//           const [hms, ms] = time.split(",");
//           const [h, m, s] = hms.split(":").map(Number);
//           return h * 3600 + m * 60 + s + Number(ms) / 1000;
//         }

//         function normalizeSubtitles(raw: any[]) {
//           return raw.map((item, index) => {
//             const original =
//               item.original ??
//               item.text ??
//               item.content ??
//               item.sentence ??
//               item.caption ??
//               "";

//             const translated =
//               item.translated ??
//               item.translation ??
//               item.translatedText ??
//               item.target ??
//               "";

//             return {
//               id: item.id ?? index,
//               start:
//                 typeof item.start === "string"
//                   ? srtToSeconds(item.start)
//                   : item.start,
//               end:
//                 typeof item.end === "string"
//                   ? srtToSeconds(item.end)
//                   : item.end,

//               text: original,

//               original,
//               translated,
//             };
//           });
//         }

//         function normalizeSubtitlesFromUrl(data: any) {
//           const { original, translated } = data;

//           if (!Array.isArray(original) || !Array.isArray(translated)) {
//             throw new Error("Invalid URL subtitle format");
//           }

//           return original.map((item: any, index: number) => {
//             const translatedItem = translated[index];

//             // Handle numeric timestamps
//             if (typeof item.start === "number") {
//               const originalText = item.text ?? item.original ?? "";
//               const translatedText =
//                 translatedItem?.text ?? translatedItem?.translated ?? "";

//               return {
//                 id: index,
//                 start: item.start,
//                 end: item.end,

//                 text: originalText,
//                 original: originalText,
//                 translated: translatedText,
//               };
//             }

//             // Handle SRT timestamps
//             if (typeof item.start === "string") {
//               return {
//                 id: index,
//                 start: srtToSeconds(item.start),
//                 end: srtToSeconds(item.end),
//                 original: item.original ?? item.text ?? "",
//                 translated:
//                   translatedItem?.translated ?? translatedItem?.text ?? "",
//               };
//             }

//             throw new Error("Unknown URL subtitle format");
//           });
//         }

//         console.log("Creating lecture in DB...");
//         const storedDuration = localStorage.getItem("videoDuration");
//         console.log("Stored Duration:", storedDuration);

//         // console.log("TITLE BEFORE API:", title);

//         // console.log("EMAIL SENT:", localStorage.getItem("email"));
//         // console.log(
//         //   "FULL AUTH HEADER:",
//         //   `Bearer ${localStorage.getItem("email")}`,
//         // );

//         setSubtitles([]);
//         setStage("Processing video with AI...");

//         let responseData;

//         let videoPath = "";

//         if (file) {
//           const formData = new FormData();
//           formData.append("video", file);
//           formData.append("target_lang", targetLang);

//           console.log("Sending language to backend:", targetLang);

//           const res = await fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/api/generate-subtitle`,
//             {
//               method: "POST",
//               body: formData,
//             },
//           );

//           if (!res.ok) {
//             const err = await res.json();
//             throw new Error(err.message || "Upload failed");
//           }
//           // if (!res.ok) {
//           //   throw new Error("Upload failed");
//           // }

//           responseData = await res.json();
//           console.log(
//             "FILE BACKEND RESPONSE FULL:",
//             JSON.stringify(responseData, null, 2),
//           );

//           // videoPath = `${process.env.BASE_URL}/uploads/${responseData.video}`;
//           const baseUrl =
//             process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

//           videoPath = `${baseUrl}/uploads/${responseData.video}`;

//           setVideoUrl(videoPath);
//           localStorage.setItem("lecturely_video", videoPath);
//           console.log("VIDEO PATH:", videoPath);
//           // setVideoUrl(`http://localhost:5000/uploads/${responseData.video}`);
//           // setVideoUrl(URL.createObjectURL(file));
//         } else if (videoUrl) {
//           const res = await fetch(
//             `http://127.0.0.1:8000/generate-from-url?url=${encodeURIComponent(
//               videoUrl,
//             )}&target_lang=${targetLang}`,
//             {
//               method: "POST",
//             },
//           );

//           if (!res.ok) {
//             throw new Error("URL processing failed");
//           }

//           responseData = await res.json();
//           console.log("URL BACKEND RESPONSE:", responseData);

//           videoPath = `http://127.0.0.1:8000${responseData.video}`;

//           setVideoUrl(videoPath);
//         }

//         // setVideoUrl(`http://localhost:5000/uploads/${response.video}`);
//         // setSubtitles(responseData.original || responseData.subtitles || []);

//         let normalized;

//         if (responseData.subtitles) {
//           normalized = normalizeSubtitles(responseData.subtitles);
//         } else if (responseData.original && responseData.translated) {
//           normalized = normalizeSubtitlesFromUrl(responseData);
//         } else {
//           throw new Error("Unsupported backend response structure");
//         }

//         // const rawSubs = responseData.original || responseData.subtitles || [];
//         // const normalized = normalizeSubtitles(rawSubs);
//         setSubtitles(normalized);

//         // ✅ AFTER subtitles are ready
//         console.log("Saving lecture WITH subtitles...");

//         const email = session?.user?.email;

//         if (!email) {
//           console.error("No email found in session");
//           return;
//         }

//         console.log("SESSION EMAIL:", session?.user?.email);
//         console.log("LOCAL STORAGE EMAIL:", localStorage.getItem("email"));
//         console.log("TITLE BEFORE API:", title);

//         // const cleanTitle = title?.trim();
//         const storedTitle = localStorage.getItem("title");

//         if (!title && !storedTitle) {
//           console.warn("Title not ready yet");
//           return;
//         }

//         const cleanTitle =
//           title?.trim() || storedTitle?.trim() || "Untitled Lecture";

//         const lectureRes = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/api/lectures`,
//           {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${email}`,
//             },
//             body: JSON.stringify({
//               // title: title || file?.name || "Untitled Lecture",
//               title:
//                 cleanTitle && cleanTitle.length > 0
//                   ? cleanTitle
//                   : "Untitled Lecture",

//               duration: storedDuration ? Number(storedDuration) : 0,

//               videoUrl: videoPath,

//               subtitles: normalized.map((s) => ({
//                 start: s.start,
//                 end: s.end,
//                 text: s.original,
//               })),

//               translatedSubtitles: normalized.map((s) => ({
//                 start: s.start,
//                 end: s.end,
//                 text: s.translated,
//               })),

//               notes: responseData.notes || {
//                 summary: "",
//                 keyPoints: [],
//                 importantConcepts: [],
//               },
//             }),
//           },
//         );

//         const lectureData = await lectureRes.json();

//         console.log("EMAIL FROM SESSION:", session?.user?.email);
//         console.log("Lecture response:", lectureData);
//         console.log("Response Data:", responseData);

//         if (!lectureRes.ok) {
//           throw new Error(lectureData.message || "Lecture creation failed");
//         }

//         // store lectureId for later use
//         localStorage.setItem("lectureId", lectureData.lecture._id);

//         setStage("Finalizing...");
//         setProgress(100);

//         router.push(`/editor/${lectureData.lecture._id}`);
//       } catch (error) {
//         console.error("Processing Error:", error);
//         alert("Processing failed");
//         router.push("/");
//       }
//     };

//     run();
//   }, [file, videoUrl, targetLang, session, title]);

//   return <ProcessingView progress={progress} stage={stage} />;
// }
