import Lecture from "../models/lectureModel.js";
import User from "../models/userModels.js";
import { processPipeline } from "../services/pipelineService.js";

export const createLecture = async (req, res) => {
  try {
    const { title, duration, videoUrl, targetLang } = req.body;

    // ✅ 1. Validate input
    const isAuthenticated = !!req.user;

    let finalTitle = title?.trim();

    if (isAuthenticated && !finalTitle) {
      return res.status(400).json({ message: "Title is required" });
    }

    // ✅ fallback for guests
    if (!finalTitle) {
      finalTitle = "Untitled Lecture";
    }

    if (!videoUrl) {
      return res.status(400).json({ message: "Video URL is required" });
    }

    console.log("LOOKING FOR USER EMAIL:", req.user.email);

    // ✅ 2. Get user
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 🚫 3. Check credits
    if (user.stats.creditsRemaining <= 0) {
      return res.status(403).json({ message: "No credits remaining" });
    }

    // 🚫 4. Prevent duplicates
    const existingLecture = await Lecture.findOne({
      user: user._id,
      title: title.trim(),
      createdAt: {
        $gte: new Date(Date.now() - 5 * 60 * 1000),
      },
    });

    if (existingLecture) {
      return res.status(409).json({ message: "Lecture already exists" });
    }

    // 🔥 5. PROCESS PIPELINE (CORE PART)
    console.log("Starting AI pipeline...");
    // ✅ TEMP TEST
    const language = targetLang || "ta";
    // const audioPath = "uploads/test2.mp4";
    // const pipelineResult = await processPipeline(audioPath, language);

    const pipelineResult = await processPipeline(videoUrl, language);

    const { rawTranscript, refined, translated, context, notes } =
      pipelineResult;

    console.log("Pipeline completed");

    // ✅ 6. Create lecture
    const lecture = await Lecture.create({
      user: user._id,
      title: title.trim(),
      duration,
      content: refined, // refined transcript
      subtitles: rawTranscript || [],
      translatedSubtitles: translated || [],
      contextData: context || {}, // optional (good for future)
      notes: notes || {}, // optional (good for future)
    });

    // 🔁 7. Update stats
    user.stats.subtitlesGenerated += 1;
    user.stats.translationsDone += 1;

    const minutes = duration ? duration / 60 : 1;
    user.stats.minutesProcessed += minutes;

    user.stats.languagesUsed = Math.max(user.stats.languagesUsed, 1);
    user.stats.creditsRemaining -= 1;

    // 🧾 8. Update recent lectures
    user.recentLectures.unshift({
      lectureId: lecture._id,
      title: lecture.title,
      createdAt: lecture.createdAt,
    });

    if (user.recentLectures.length > 10) {
      user.recentLectures = user.recentLectures.slice(0, 10);
    }

    await user.save();

    // ✅ 9. Response
    res.status(201).json({
      message: "Lecture created successfully",
      lecture,
      stats: user.stats,
      recentLectures: user.recentLectures,
    });
  } catch (error) {
    console.error("Create Lecture Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/lectures
export const getLectures = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    const lectures = await Lecture.find({ user: user._id }).sort({
      createdAt: -1,
    });

    res.json(lectures);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/lectures/:id
export const getLectureById = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });

    const lecture = await Lecture.findOne({
      _id: req.params.id,
      user: user._id,
    });

    if (!lecture) {
      return res.status(404).json({ message: "Lecture not found" });
    }

    res.json(lecture);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Lecture Title

export const updateLectureTitle = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

      const user = await User.findOne({ email: req.user.email });

      const lecture = await Lecture.findOne({
        _id: req.params.id,
        user: user._id,
      });

      if (!lecture) {
        return res.status(404).json({ message: "Lecture not found" });
      }

      lecture.title = title.trim();
      await lecture.save();

      // Update title in recent lectures
      const index = user.recentLectures.findIndex(
        (l) => l.lectureId.toString() === lecture._id.toString()
      );

      if (index !== -1) {
        user.recentLectures[index].title = lecture.title;
        await user.save();
      }

      res.json({ message: "Title updated successfully", lecture });
  } catch (err) {
    console.error("Update Lecture Title Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// import Lecture from "../models/lectureModel.js";
// import User from "../models/userModels.js";

// export const createLecture = async (req, res) => {
//   try {
//     const { title, duration, content, subtitles, translatedSubtitles } =
//       req.body;

//     // ✅ 1. Validate input
//     if (!title || title.trim() === "") {
//       return res.status(400).json({ message: "Title is required" });
//     }
//     console.log("LOOKING FOR USER EMAIL:", req.user.email);
//     // ✅ 2. Get user from middleware
//     const user = await User.findOne({ email: req.user.email });
//     console.log("USER FOUND:", user);

//     const allUsers = await User.find();
//     console.log("ALL USERS IN DB:", allUsers);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // 🚫 3. Check credits BEFORE doing anything
//     if (user.stats.creditsRemaining <= 0) {
//       return res.status(403).json({ message: "No credits remaining" });
//     }

//     // 🚫 4. Prevent duplicates (basic + safe)
//     const existingLecture = await Lecture.findOne({
//       user: user._id,
//       title: title.trim(),
//       createdAt: {
//         $gte: new Date(Date.now() - 5 * 60 * 1000),
//       },
//     });

//     if (existingLecture) {
//       return res.status(409).json({ message: "Lecture already exists" });
//     }

//     // 🧠 5. Calculate hours saved (you can improve later)
//     // const hoursSaved = duration ? duration / 60 : 0.5;

//     // ✅ 6. Create lecture
//     const lecture = await Lecture.create({
//       user: user._id,
//       title: title.trim(),
//       duration,
//       content,
//       subtitles: subtitles || [],
//       translatedSubtitles: translatedSubtitles || [],
//     });

//     // 🔁 7. Update stats
//     // 🎯 Increment subtitle generation
//     user.stats.subtitlesGenerated += 1;

//     // 🌍 Assume 1 translation per lecture (you can refine later)
//     user.stats.translationsDone += 1;

//     // ⏱ Convert duration → minutes processed
//     const minutes = duration ? duration / 60 : 1;
//     user.stats.minutesProcessed += minutes;

//     // 🌐 Track languages (basic version)
//     user.stats.languagesUsed = Math.max(user.stats.languagesUsed, 1);

//     // 💳 Credits
//     user.stats.creditsRemaining -= 1;

//     // 🧾 8. Update recent lectures (prepend)
//     user.recentLectures.unshift({
//       lectureId: lecture._id,
//       title: lecture.title,
//       createdAt: lecture.createdAt,
//     });

//     // ✂️ 9. Keep only latest 10
//     if (user.recentLectures.length > 10) {
//       user.recentLectures = user.recentLectures.slice(0, 10);
//     }

//     await user.save();

//     // ✅ 10. Response (IMPORTANT for frontend)
//     res.status(201).json({
//       message: "Lecture created successfully",
//       lecture,
//       stats: user.stats,
//       recentLectures: user.recentLectures,
//     });
//   } catch (error) {
//     console.error("Create Lecture Error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // GET /api/lectures
// export const getLectures = async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.user.email });

//     const lectures = await Lecture.find({ user: user._id }).sort({
//       createdAt: -1,
//     });

//     res.json(lectures);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// // GET /api/lectures/:id
// export const getLectureById = async (req, res) => {
//   try {
//     const user = await User.findOne({ email: req.user.email });

//     const lecture = await Lecture.findOne({
//       _id: req.params.id,
//       user: user._id,
//     });

//     if (!lecture) {
//       return res.status(404).json({ message: "Lecture not found" });
//     }

//     res.json(lecture);
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// };
