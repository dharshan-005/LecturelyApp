function timeToSeconds(time: string) {
  const [hms, ms] = time.split(",");
  const [h, m, s] = hms.split(":").map(Number);

  return h * 3600 + m * 60 + s + Number(ms) / 1000;
}

export function parseSRT(srtText: string) {
  const cleaned = srtText.replace(/\r/g, "").trim();
  const blocks = cleaned.split(/\n\s*\n/);

  const subtitles = [];

  for (let block of blocks) {
    const lines = block.split("\n").map((l) => l.trim());

    if (lines.length >= 3) {
      const timeLine = lines[1];
      const [startStr, endStr] = timeLine.split(" --> ");

      subtitles.push({
        id: subtitles.length + 1,
        start: timeToSeconds(startStr),
        end: timeToSeconds(endStr),
        original: lines.slice(2).join(" "),
        translated: lines.slice(2).join(" "),
      });
    }
  }

  return subtitles;
}

// export function parseSRT(srtText: string) {
//   const cleaned = srtText.replace(/\r/g, "").trim();

//   const blocks = cleaned.split(/\n\s*\n/);

//   const subtitles = [];

//   for (let block of blocks) {
//     const lines = block.split("\n").map((l) => l.trim());

//     if (lines.length >= 3) {
//       const time = lines[1];
//       const text = lines.slice(2).join(" ");

//       subtitles.push({
//         id: subtitles.length + 1,
//         time,
//         original: text,
//         translated: text,
//       });
//     }
//   }

//   return subtitles;
// }

// import { Subtitle } from "../types";

// export function parseSRT(srt: string): Subtitle[] {
//   const blocks = srt.trim().split("\n\n");

//   return blocks.map((block, index) => {
//     const lines = block.split("\n");
//     const [start, end] = lines[1].split(" --> ");

//     return {
//       id: index + 1,
//       start,
//       end,
//       original: "", // backend can add later
//       translated: lines.slice(2).join(" "),
//     };
//   });
// }