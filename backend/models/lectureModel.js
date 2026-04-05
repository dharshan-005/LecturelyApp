import mongoose from "mongoose";

const subtitleSchema = new mongoose.Schema(
  {
    start: { type: Number, required: true },
    end: { type: Number, required: true },
    text: { type: String, required: true },
  },
  { _id: false },
);

const lectureSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    duration: {
      type: Number,
      default: 0,
    },

    content: {
      type: String,
    },

    subtitles: {
      type: [subtitleSchema],
      default: [],
    },

    translatedSubtitles: {
      type: [subtitleSchema],
      default: [],
    },

    language: {
      type: String,
      default: "en",
    },

    notes: {
      summary: String,
      keyPoints: [String],
      importantConcepts: [String],
    },
  },
  { timestamps: true },
);

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
