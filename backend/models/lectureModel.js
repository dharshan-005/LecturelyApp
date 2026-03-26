import mongoose from "mongoose";

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
      type: Array,
      default: [],
    },

    translatedSubtitles: {
      type: Array,
      default: [],
    },

    language: {
      type: String,
      default: "en",
    },
  },
  { timestamps: true },
);

const Lecture = mongoose.model("Lecture", lectureSchema);

export default Lecture;
