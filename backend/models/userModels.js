import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    userName: String,
    image: String,

    password: {
      type: String,
      required: function () {
        return this.oauth === false; // required only if NOT Google user
      },
    },
    oauth: {
      type: Boolean,
      default: false,
    },

    stats: {
      subtitlesGenerated: {
        type: Number,
        default: 0,
      },
      translationsDone: {
        type: Number,
        default: 0,
      },
      minutesProcessed: {
        type: Number,
        default: 0,
      },
      languagesUsed: {
        type: Number,
        default: 0,
      },
      creditsRemaining: {
        type: Number,
        default: 10,
      },
      totalCredits: {
        type: Number,
        default: 10,
      },
    },

    recentLectures: [
      {
        _id: false,
        lectureId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Lecture",
        },
        title: String,
        createdAt: { type: Date },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
