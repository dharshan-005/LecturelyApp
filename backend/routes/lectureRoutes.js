import express from "express";
import { protect } from "../middleware/auth.js";
import {
  createLecture,
  getLectureById,
  getLectures,
  updateLectureTitle,
} from "../controllers/lectureController.js";
import { processPipeline } from "../services/pipelineService.js";

const router = express.Router();

router.post("/", protect, createLecture);
router.get("/", protect, getLectures);
router.get("/:id", protect, getLectureById);
router.patch("/:id", protect, updateLectureTitle);

router.post("/test-pipeline", async (req, res) => {
  try {
    const { videoUrl } = req.body;

    const result = await processPipeline(videoUrl);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
