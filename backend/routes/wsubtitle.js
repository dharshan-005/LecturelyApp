import express from "express";
import multer from "multer";
import { exec } from "child_process";
import path from "path";
import fs from "fs";
import axios from "axios";

const router = express.Router();

// Storage config
// const upload = multer({
//   dest: "uploads/",
// });

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

async function translateText(text) {
  try {
    const response = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params: {
          q: text,
          langpair: "en|ta",
        },
      },
    );

    console.log("Translation response:", response.data);

    return response.data.responseData.translatedText;
  } catch (error) {
    console.error(
      "Translation API error:",
      error.response?.data || error.message,
    );
    throw error;
  }
}

// POST /generate-subtitle
router.post("/generate-subtitle", upload.single("video"), async (req, res) => {
  try {
    const videoPath = req.file.path;
    const fileName = req.file.filename;

    const wavPath = `uploads/${fileName}.wav`;
    const srtPath = `outputs/${fileName}.srt`;

    // Step 1: Convert MP4 to WAV
    const ffmpegCmd = `ffmpeg -i "${videoPath}" -ar 16000 -ac 1 -c:a pcm_s16le "${wavPath}" -y`;

    exec(ffmpegCmd, (ffmpegError) => {
      if (ffmpegError) {
        console.error("FFmpeg error:", ffmpegError);
        return res.status(500).json({ error: "Audio conversion failed" });
      }

      // Step 2: Run Whisper
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

          let subtitleArray = [];
          let index = 1;

          for (const segment of segments) {
            const start = segment.timestamps.from; // already formatted
            const end = segment.timestamps.to; // already formatted
            const originalText = segment.text.trim();

            const translatedText = await translateText(originalText);

            subtitleArray.push({
              id: index,
              start,
              end,
              original: originalText,
              translated: translatedText,
            });

            // srtContent += `${index}\n`;
            // srtContent += `${start} --> ${end}\n`;
            // srtContent += `${translatedText}\n\n`;

            index++;

            // small delay to avoid rate limit
            await new Promise((resolve) => setTimeout(resolve, 300));
          }

          // const finalSrtPath = path.join(
          //   process.cwd(),
          //   "outputs",
          //   `${fileName}_ta.srt`,
          // );

          res.json({
            video: fileName,
            subtitles: subtitleArray,
          });

          // fs.writeFileSync(finalSrtPath, srtContent);
          // res.sendFile(finalSrtPath);

          // res.setHeader("Content-Type", "text/plain");
          // res.send(srtContent);
        } catch (err) {
          console.error("Processing error:", err);
          console.error("Stack:", err.stack);
          res.status(500).json({ error: "Translation failed" });
        }
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
