import Lecture from "../models/lectureModel.js";
import { generateSubtitles } from "./subtitleService.js";
import { processWithAI } from "./aiService.js"; // ✅ NEW

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

// 🚀 OPTIMIZED PIPELINE (1 AI CALL ONLY)
export const processPipeline = async (
  lectureId,
  videoUrl,
  targetLang = "ta",
) => {
  try {
    // STEP 1 — Transcription
    await Lecture.findByIdAndUpdate(lectureId, {
      "processing.progress": 10,
      "processing.stage": "Transcribing audio...",
    });

    const { subtitles, fullText } = await generateSubtitles(videoUrl);

    console.log("RAW SUBTITLE SAMPLE:", subtitles[0]);

    const mergedSubtitles = mergeSegments(subtitles).map((s, i) => ({
      id: i,
      start: s.start,
      end: s.end,
      original: s.text || s.original || "", // ✅ robust fix
      translated: "",
    }));

    // STEP 2 — AI Processing (🔥 SINGLE CALL)
    await Lecture.findByIdAndUpdate(lectureId, {
      "processing.progress": 50,
      "processing.stage": "Processing with AI...",
    });

    const aiResult = await processWithAI(fullText, targetLang);

    const refined = aiResult.refined || fullText;
    const notes = aiResult.notes || {
      summary: "",
      keyPoints: [],
      importantConcepts: [],
    };

    // 🔁 Map translated text back to subtitles
    const translated = mergedSubtitles.map((sub, i) => ({
      ...sub,
      translated: aiResult.translated?.[i] || sub.original,
    }));
    console.log("AI RESULT:", aiResult);

    // const translated = mergedSubtitles.map((sub, i) => ({
    //   id: sub.id,
    //   start: sub.start,
    //   end: sub.end,
    //   original: sub.text,
    //   translated: aiResult.translated?.[i] || sub.text,
    // }));

    // STEP 3 — Final Save
    const finalSubtitles = mergedSubtitles.map((sub, i) => ({
      id: sub.id,
      start: sub.start,
      end: sub.end,
      original: sub.original,
      translated: aiResult.translated?.[i] || sub.original,
    }));

    await Lecture.findByIdAndUpdate(lectureId, {
      content: refined,
      subtitles: finalSubtitles, // ✅ FIXED
      notes: notes,

      "processing.progress": 100,
      "processing.stage": "Completed",
      "processing.status": "completed",
    });

    const saved = await Lecture.findById(lectureId);
    console.log("SAVED SUBTITLE SAMPLE:", saved.subtitles[0]);
  } catch (error) {
    await Lecture.findByIdAndUpdate(lectureId, {
      "processing.status": "failed",
      "processing.stage": "Error occurred",
    });

    console.error("Pipeline Error:", error);
  }
};

// import Lecture from "../models/lectureModel.js";

// import { extractContext } from "./contextService.js";
// import { refineTranscript } from "./refinementService.js";
// import { generateSubtitles } from "./subtitleService.js";
// import { translateText } from "./translateService.js";
// import { generateNotes } from "./notesService.js";

// function mergeSegments(subtitles) {
//   const merged = [];

//   for (let i = 0; i < subtitles.length; i++) {
//     let current = { ...subtitles[i] };

//     while (i < subtitles.length - 1 && !current.text.trim().endsWith(".")) {
//       const next = subtitles[i + 1];

//       current.text += " " + next.text;
//       current.end = next.end;

//       i++;
//     }

//     merged.push(current);
//   }

//   return merged;
// }

// // 🔥 IMPORTANT CHANGE: add lectureId
// export const processPipeline = async (
//   lectureId,
//   videoUrl,
//   targetLang = "ta",
// ) => {
//   try {
//     // STEP 1 — Transcription
//     await Lecture.findByIdAndUpdate(lectureId, {
//       "processing.progress": 10,
//       "processing.stage": "Transcribing audio...",
//     });

//     const { subtitles, fullText } = await generateSubtitles(videoUrl);

//     const mergedSubtitles = mergeSegments(subtitles);

//     // STEP 2 — Context
//     await Lecture.findByIdAndUpdate(lectureId, {
//       "processing.progress": 30,
//       "processing.stage": "Understanding context...",
//     });

//     const context = await extractContext(fullText);

//     // STEP 3 — Refinement
//     await Lecture.findByIdAndUpdate(lectureId, {
//       "processing.progress": 50,
//       "processing.stage": "Refining transcript...",
//     });

//     const refined = await refineTranscript(fullText, context);

//     // STEP 4 — Translation
//     await Lecture.findByIdAndUpdate(lectureId, {
//       "processing.progress": 70,
//       "processing.stage": "Translating subtitles...",
//     });

//     const translated = await translateText(mergedSubtitles, targetLang);

//     // STEP 5 — Notes
//     await Lecture.findByIdAndUpdate(lectureId, {
//       "processing.progress": 90,
//       "processing.stage": "Generating notes...",
//     });

//     const notes = await generateNotes(refined);

//     // FINAL SAVE
//     await Lecture.findByIdAndUpdate(lectureId, {
//       content: refined,
//       subtitles: mergedSubtitles,
//       translatedSubtitles: translated,
//       notes: notes,

//       "processing.progress": 100,
//       "processing.stage": "Completed",
//       "processing.status": "completed",
//     });
//   } catch (error) {
//     await Lecture.findByIdAndUpdate(lectureId, {
//       "processing.status": "failed",
//       "processing.stage": "Error occurred",
//     });

//     console.error("Pipeline Error:", error);
//   }
// };

// import { extractContext } from "./contextService.js";
// import { refineTranscript } from "./refinementService.js";
// import { generateSubtitles } from "./subtitleService.js";
// import { translateText } from "./translateService.js";
// import { generateNotes } from "./notesService.js";

// function mergeSegments(subtitles) {
//   const merged = [];

//   for (let i = 0; i < subtitles.length; i++) {
//     let current = { ...subtitles[i] };

//     while (i < subtitles.length - 1 && !current.text.trim().endsWith(".")) {
//       const next = subtitles[i + 1];

//       current.text += " " + next.text;
//       current.end = next.end;

//       i++;
//     }

//     merged.push(current);
//   }

//   return merged;
// }

// export const processPipeline = async (videoUrl, targetLang = "ta") => {
//   try {
//     console.log("Step 1: Transcription");
//     // const rawTranscript = await generateSubtitles(videoUrl);
//     const { subtitles, fullText } = await generateSubtitles(videoUrl);

//     // ✅ Convert to subtitle array FIRST
//     // const subtitleArray = rawTranscript.split(". ").map((sentence, index) => ({
//     //   id: index + 1,
//     //   start: index * 5,
//     //   end: index * 5 + 5,
//     //   text: sentence,
//     // }));

//     console.log("Step 2: Context Extraction");
//     const context = await extractContext(fullText);

//     console.log("Step 3: Refinement");
//     const refined = await refineTranscript(fullText, context);

//     console.log("Step 4: Translation");

//     // ✅ FIX: pass subtitle array
//     // const translated = await translateText(subtitles, targetLang);
//     const mergedSubtitles = mergeSegments(subtitles);

//     const translated = await translateText(mergedSubtitles, targetLang);

//     console.log("Step 5: Notes Generation");
//     const notes = await generateNotes(refined);

//     return {
//       rawTranscript: mergedSubtitles,
//       refined,
//       translated, // ✅ real translated output
//       context,
//       notes,
//     };
//   } catch (error) {
//     console.error("Pipeline Error:", error);
//     throw error;
//   }
// };
