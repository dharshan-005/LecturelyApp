import { exec } from "child_process";
import path from "path";
import fs from "fs";

function srtToSeconds(time) {
  const [hms, ms] = time.split(",");
  const [h, m, s] = hms.split(":").map(Number);
  return h * 3600 + m * 60 + s + Number(ms) / 1000;
}

export const generateSubtitles = async (videoPath) => {
  return new Promise((resolve, reject) => {
    const fileName = path.basename(videoPath);

    const wavPath = `uploads/${fileName}.wav`;

    const ffmpegCmd = `ffmpeg -i "${videoPath}" -ar 16000 -ac 1 -c:a pcm_s16le "${wavPath}" -y`;

    exec(ffmpegCmd, (ffmpegError) => {
      if (ffmpegError) {
        return reject("Audio conversion failed");
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

      exec(whisperCmd, (whisperError) => {
        if (whisperError) {
          return reject("Transcription failed");
        }

        try {
          const jsonPath = path.join(
            process.cwd(),
            "outputs",
            `${fileName}.json`,
          );

          const whisperData = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));

          const segments = whisperData.transcription;

          // const subtitles = segments.map((segment, index) => ({
          //   id: index + 1,
          //   start: srtToSeconds(segment.timestamps.from),
          //   end: srtToSeconds(segment.timestamps.to),
          //   text: segment.text.trim(),
          // }));

          // const textOnly = subtitles.map((s) => s.text).join(" ");

          const subtitles = segments.map((segment, index) => ({
            id: index + 1,
            start: srtToSeconds(segment.timestamps.from),
            end: srtToSeconds(segment.timestamps.to),
            // text: segment.text.trim(),
            text: segment.text
              .replace(/\s+/g, " ")
              .replace(/\u200B/g, "")
              .trim(),
          }));

          resolve({
            subtitles,
            // fullText: subtitles.map((s) => s.text).join(" "),
            fullText: subtitles
              .map((s) => s.text.trim())
              .join(" ")
              .replace(/\s+/g, " "),
          });
        } catch (err) {
          reject("Processing error");
        }
      });
    });
  });
};
