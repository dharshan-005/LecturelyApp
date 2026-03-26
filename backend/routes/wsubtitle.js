import dotenv from "dotenv";
dotenv.config();

import express from "express";
import multer from "multer";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

function srtToSeconds(time) {
  const [hms, ms] = time.split(",");
  const [h, m, s] = hms.split(":").map(Number);
  return h * 3600 + m * 60 + s + Number(ms) / 1000;
}

async function callGemini(prompt) {
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return response.text;
    } catch (err) {
      if (err.status === 503 && i < maxRetries - 1) {
        console.log("Gemini overloaded, retrying...");
        await new Promise((resolve) => setTimeout(resolve, 4000));
      } else {
        throw err;
      }
    }
  }
}

router.post("/generate-subtitle", upload.single("video"), async (req, res) => {
  try {
    const videoPath = req.file.path;
    const fileName = req.file.filename;
    const targetLang = req.body.target_lang || "ta";

    console.log("Language from frontend:", targetLang);

    const wavPath = `uploads/${fileName}.wav`;

    const ffmpegCmd = `ffmpeg -i "${videoPath}" -ar 16000 -ac 1 -c:a pcm_s16le "${wavPath}" -y`;

    exec(ffmpegCmd, (ffmpegError) => {
      if (ffmpegError) {
        console.error("FFmpeg error:", ffmpegError);
        return res.status(500).json({ error: "Audio conversion failed" });
      }

      const whisperPath = path.join(
        process.cwd(),
        "whisper.cpp/build/bin/Release/whisper-cli.exe",
      );

      const modelPath = path.join(
        process.cwd(),
        "whisper.cpp/models/ggml-small.bin",
      );

      const whisperCmd = `"${whisperPath}" -m "${modelPath}" -f "${wavPath}" -oj -of "outputs/${fileName}"`;

      exec(whisperCmd, async (whisperError) => {
        console.log("Whisper finished running");

        if (whisperError) {
          console.error("Whisper error:", whisperError);
          return res.status(500).json({ error: "Transcription failed" });
        }

        try {
          const jsonPath = path.join(
            process.cwd(),
            "outputs",
            `${fileName}.json`,
          );

          const whisperData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

          const segments = whisperData.transcription;

          const subtitles = segments.map((segment, index) => ({
            id: index + 1,
            start: srtToSeconds(segment.timestamps.from),
            end: srtToSeconds(segment.timestamps.to),
            text: segment.text.trim(),
          }));

          const textArray = subtitles.map((s) => s.text);

          console.log("Sending batch to Gemini...");

          const prompt = `Translate the following subtitles to ${targetLang}.
          Return ONLY a JSON array of translated sentences in the same order.
          ${JSON.stringify(textArray)}`;

          const raw = await callGemini(prompt);

          let text = raw.trim();

          text = text
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();
          // }

          const translated = JSON.parse(text);

          const finalSubtitles = subtitles.map((sub, i) => ({
            id: sub.id,
            start: sub.start,
            end: sub.end,
            original: sub.text,
            translated: translated[i] || sub.text,
          }));

          res.json({
            video: fileName,
            subtitles: finalSubtitles,
          });
        } catch (err) {
          console.error("Processing error:", err);

          res.status(500).json({
            error: "Translation failed",
          });
        }
      });
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

export default router;

// import express from "express";
// import multer from "multer";
// import { exec } from "child_process";
// import path from "path";
// import fs from "fs";
// import axios from "axios";

// const router = express.Router();

// // Storage config
// // const upload = multer({
// //   dest: "uploads/",
// // });

// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = Date.now() + ext;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage });

// function srtToSeconds(time) {
//   const [hms, ms] = time.split(",");
//   const [h, m, s] = hms.split(":").map(Number);
//   return h * 3600 + m * 60 + s + Number(ms) / 1000;
// }

// async function translateText(text, targetLang) {
//   try {
//     const response = await axios.get(
//       "https://api.mymemory.translated.net/get",
//       {
//         params: {
//           q: text,
//           langpair: `en|${targetLang}`,
//         },
//       },
//     );

//     console.log("Translation response:", response.data);

//     return response.data.responseData.translatedText;
//   } catch (error) {
//     console.error(
//       "Translation API error:",
//       error.response?.data || error.message,
//     );
//     throw error;
//   }
// }

// // POST /generate-subtitle
// router.post("/generate-subtitle", upload.single("video"), async (req, res) => {
//   try {
//     const videoPath = req.file.path;
//     const fileName = req.file.filename;
//     const targetLang = req.body.target_lang || "ta";
//     console.log("Language from frontend:", req.body.target_lang);

//     const wavPath = `uploads/${fileName}.wav`;
//     const srtPath = `outputs/${fileName}.srt`;

//     // Step 1: Convert MP4 to WAV
//     const ffmpegCmd = `ffmpeg -i "${videoPath}" -ar 16000 -ac 1 -c:a pcm_s16le "${wavPath}" -y`;

//     exec(ffmpegCmd, (ffmpegError) => {
//       if (ffmpegError) {
//         console.error("FFmpeg error:", ffmpegError);
//         return res.status(500).json({ error: "Audio conversion failed" });
//       }

//       // Step 2: Run Whisper
//       const whisperPath = path.join(
//         process.cwd(),
//         "whisper.cpp/build/bin/Release/whisper-cli.exe",
//       );

//       const modelPath = path.join(
//         process.cwd(),
//         "whisper.cpp/models/ggml-small.bin",
//       );

//       const whisperCmd = `"${whisperPath}" -m "${modelPath}" -f "${wavPath}" -oj -of "outputs/${fileName}"`;

//       exec(whisperCmd, async (whisperError) => {
//         console.log("Whisper finished running");

//         if (whisperError) {
//           console.error("Whisper error:", whisperError);
//           return res.status(500).json({ error: "Transcription failed" });
//         }

//         try {
//           const jsonPath = path.join(
//             process.cwd(),
//             "outputs",
//             `${fileName}.json`,
//           );

//           const whisperData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

//           const segments = whisperData.transcription;

//           let subtitleArray = [];
//           let index = 1;

//           for (const segment of segments) {
//             const start = segment.timestamps.from; // already formatted
//             const end = segment.timestamps.to; // already formatted
//             const originalText = segment.text.trim();

//             const translatedText = await translateText(originalText, targetLang);

//             // const startSec = srtToSeconds(start);
//             // const endSec = srtToSeconds(end);
//             // const duration = endSec - startSec;

//             // const maxSegment = 4; // seconds

//             // if (duration > maxSegment) {
//             //   const pieces = Math.ceil(duration / maxSegment);
//             //   const words = originalText.split(" ");
//             //   const wordsPerPiece = Math.ceil(words.length / pieces);

//             //   for (let i = 0; i < pieces; i++) {
//             //     const pieceStart = startSec + i * maxSegment;
//             //     const pieceEnd = Math.min(pieceStart + maxSegment, endSec);

//             //     const textPiece = words
//             //       .slice(i * wordsPerPiece, (i + 1) * wordsPerPiece)
//             //       .join(" ");

//             //     const translatedPiece = await translateText(textPiece);

//             //     subtitleArray.push({
//             //       id: index++,
//             //       start: pieceStart,
//             //       end: pieceEnd,
//             //       original: textPiece,
//             //       translated: translatedPiece,
//             //     });
//             //   }
//             // } else {
//             //   subtitleArray.push({
//             //     id: index++,
//             //     start: startSec,
//             //     end: endSec,
//             //     original: originalText,
//             //     translated: translatedText,
//             //   });
//             // }

//             subtitleArray.push({
//               id: index,
//               start: srtToSeconds(start),
//               end: srtToSeconds(end),
//               original: originalText,
//               translated: translatedText,
//             });

//             // srtContent += `${index}\n`;
//             // srtContent += `${start} --> ${end}\n`;
//             // srtContent += `${translatedText}\n\n`;

//             index++;

//             // small delay to avoid rate limit
//             await new Promise((resolve) => setTimeout(resolve, 300));
//           }

//           // const finalSrtPath = path.join(
//           //   process.cwd(),
//           //   "outputs",
//           //   `${fileName}_ta.srt`,
//           // );

//           res.json({
//             // video: fileName,
//             subtitles: subtitleArray,
//           });

//           // fs.writeFileSync(finalSrtPath, srtContent);
//           // res.sendFile(finalSrtPath);

//           // res.setHeader("Content-Type", "text/plain");
//           // res.send(srtContent);
//         } catch (err) {
//           console.error("Processing error:", err);
//           console.error("Stack:", err.stack);
//           res.status(500).json({ error: "Translation failed" });
//         }
//       });
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

// export default router;
