export type ExportMode = "original" | "translated" | "bilingual";

function splitLines(text: string, maxLength = 45) {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    if ((current + word).length > maxLength) {
      lines.push(current.trim());
      current = word + " ";
    } else {
      current += word + " ";
    }
  }

  if (current) lines.push(current.trim());

  return lines.slice(0, 2).join("\n\n");
}

function splitSubtitle(sub: any, mode: ExportMode, maxLength = 80) {
  let text = "";

  if (mode === "original") {
    text = sub.original;
  } else if (mode === "translated") {
    text = sub.translated?.trim() || sub.original;
  } else {
    text = `${sub.original}\n${sub.translated || ""}`.trim();
  }

  const words = text.split(/\s+/);
  const parts: string[] = [];
  let current = "";

  for (const word of words) {
    if ((current + word).length > maxLength) {
      parts.push(current.trim());
      current = word + " ";
    } else {
      current += word + " ";
    }
  }

  if (current) parts.push(current.trim());

  const duration = sub.end - sub.start;
  const segmentDuration = duration / parts.length;

  return parts.map((part, i) => ({
    start: sub.start + i * segmentDuration,
    end: sub.start + (i + 1) * segmentDuration,
    text: part,
  }));
}

export function getSubtitleText(sub: any, mode: ExportMode) {
  let text = "";

  if (mode === "original") {
    text = sub.original;
  } else if (mode === "translated") {
    text = sub.translated?.trim() || sub.original;
  } else if (mode === "bilingual") {
    const original = splitLines(sub.original);
    const translated = splitLines(sub.translated || "");
    return `${original}\n${translated}`.trim();
  } else {
    text = sub.original;
  }

  console.log("FINAL TEXT:", text);

  return splitLines(text);
}

function secondsToSRT(seconds: number) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(Math.floor(seconds % 60)).padStart(2, "0");
  const ms = String(Math.floor((seconds % 1) * 1000)).padStart(3, "0");

  return `${hrs}:${mins}:${secs},${ms}`;
}

export function toSRT(subtitles: any[], mode: ExportMode) {
  let counter = 1;

  return subtitles
    .flatMap((sub) => {
      const splitSubs = splitSubtitle(sub, mode); // returns array

      return splitSubs.map((s) => {
        return `${counter++}
${secondsToSRT(s.start)} --> ${secondsToSRT(s.end)}
${s.text}`;
      });
    })
    .join("\n\n");
}
// export function toSRT(subtitles: any[], mode: ExportMode) {
//   //   return subtitles
//   //     .map((sub, index) => {
//   //       const text = getSubtitleText(sub, mode);

//   //       return `${index + 1}
//   // ${secondsToSRT(sub.start)} --> ${secondsToSRT(sub.end)}
//   // ${text}`;
//   //     })
//   //     .join("\n\n");

//   return subtitles.flatMap((sub) => splitSubtitle(sub));

//   // return "Hello World";
// }

function secondsToVTT(seconds: number) {
  const hrs = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const secs = String(Math.floor(seconds % 60)).padStart(2, "0");
  const ms = String(Math.floor((seconds % 1) * 1000)).padStart(3, "0");

  return `${hrs}:${mins}:${secs}.${ms}`;
}

export function toVTT(subtitles: any[], mode: ExportMode) {
  return (
    "WEBVTT\n\n" +
    subtitles
      .map((sub) => {
        const text = getSubtitleText(sub, mode);

        return `${secondsToVTT(sub.start)} --> ${secondsToVTT(sub.end)}
${text}`;
      })
      .join("\n\n")
  );
}

export function toTXT(subtitles: any[], mode: ExportMode) {
  return subtitles
    .map((sub) => splitSubtitle(sub, mode))
    .join("\n\n");
}

export function toJSON(subtitles: any[], mode: ExportMode) {
  return JSON.stringify(
    subtitles.map((sub) => ({
      start: sub.start,
      end: sub.end,
      text: splitSubtitle(sub, mode),
    })),
    null,
    2
  );
}