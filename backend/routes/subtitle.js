import express from "express";
import multer from "multer";
import { exec } from "child_process";
import path from "path";
import fs from "fs";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("video"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No video uploaded" });
  }

  const videoPath = req.file.path;
  const audioPath = `${videoPath}.wav`;

  // 1️⃣ Extract audio using ffmpeg
  const ffmpegCmd = `ffmpeg -y -i ${videoPath} -ac 1 -ar 16000 ${audioPath}`;

  exec(ffmpegCmd, (err) => {
    if (err) {
      return res.status(500).json({ error: "FFmpeg failed" });
    }

    // 2️⃣ Call Python pipeline
    const pythonCmd = `python python/asr_to_srt.py ${audioPath}`;

    exec(pythonCmd, (error) => {
      if (error) {
        return res.status(500).json({ error: "ASR failed" });
      }

      res.download("output/output.srt", () => {
        // Cleanup
        fs.unlinkSync(videoPath);
        fs.unlinkSync(audioPath);
      });
    });
  });
});

export default router;

// import express from "express";
// import multer from "multer";
// import path from "path";
// import { exec } from "child_process";

// const router = express.Router();

// const upload = multer({
//   dest: "uploads/",
// });

// router.post("/", upload.single("audio"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No audio file uploaded" });
//   }

//   const audioPath = req.file.path;
//   const pythonScript = "python/asr_to_srt.py";

//   const command = `py ${pythonScript} ${audioPath}`;

//   exec(command, (error, stdout, stderr) => {
//     console.log("STDOUT:", stdout);
//     console.error("STDERR:", stderr);

//     if (error) {
//       console.error("EXEC ERROR:", error);
//       return res.status(500).json({
//         error: "Processing failed",
//         details: stderr || error.message,
//       });
//     }

//     res.download("output/output.srt");
//   });
// });

// export default router;
