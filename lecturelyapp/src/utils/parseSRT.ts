import { Subtitle } from "../types";

export function parseSRT(srt: string): Subtitle[] {
  const blocks = srt.trim().split("\n\n");

  return blocks.map((block, index) => {
    const lines = block.split("\n");
    const [start, end] = lines[1].split(" --> ");

    return {
      id: index + 1,
      start,
      end,
      original: "", // backend can add later
      translated: lines.slice(2).join(" "),
    };
  });
}