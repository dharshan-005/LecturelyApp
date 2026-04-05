import { extractContext } from "./contextService.js";
import { refineTranscript } from "./refinementService.js";
import { generateSubtitles } from "./subtitleService.js";
import { translateText } from "./translateService.js";
import { generateNotes } from "./notesService.js";

function mergeSegments(subtitles) {
  const merged = [];

  for (let i = 0; i < subtitles.length; i++) {
    let current = { ...subtitles[i] };

    while (i < subtitles.length - 1 && !current.text.trim().endsWith(".")) {
      const next = subtitles[i + 1];

      current.text += " " + next.text;
      current.end = next.end;

      i++;
    }

    merged.push(current);
  }

  return merged;
}

export const processPipeline = async (videoUrl, targetLang = "ta") => {
  try {
    console.log("Step 1: Transcription");
    // const rawTranscript = await generateSubtitles(videoUrl);
    const { subtitles, fullText } = await generateSubtitles(videoUrl);

    // ✅ Convert to subtitle array FIRST
    // const subtitleArray = rawTranscript.split(". ").map((sentence, index) => ({
    //   id: index + 1,
    //   start: index * 5,
    //   end: index * 5 + 5,
    //   text: sentence,
    // }));

    console.log("Step 2: Context Extraction");
    const context = await extractContext(fullText);

    console.log("Step 3: Refinement");
    const refined = await refineTranscript(fullText, context);

    console.log("Step 4: Translation");

    // ✅ FIX: pass subtitle array
    // const translated = await translateText(subtitles, targetLang);
    const mergedSubtitles = mergeSegments(subtitles);

    const translated = await translateText(mergedSubtitles, targetLang);

    console.log("Step 5: Notes Generation");
    const notes = await generateNotes(refined);

    return {
      rawTranscript: mergedSubtitles,
      refined,
      translated, // ✅ real translated output
      context,
      notes,
    };
  } catch (error) {
    console.error("Pipeline Error:", error);
    throw error;
  }
};
