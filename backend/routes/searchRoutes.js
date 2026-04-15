import express from "express";
import Lecture from "../models/lectureModel.js";

const router = express.Router();

router.get("/:videoId", async (req, res) => {
  const { videoId } = req.params;
  const { query } = req.query;

  if (!query) return res.json([]);

  const lecture = await Lecture.findOne({ videoId });

  if (!lecture) {
    return res.status(404).json({ error: "Not found" });
  }

  const q = query.toLowerCase();

  const results = lecture.subtitles.filter(
    (seg) =>
      seg.original.toLowerCase().includes(q) ||
      seg.translated.toLowerCase().includes(q),
  );

  res.json(results);
});

export default router;
