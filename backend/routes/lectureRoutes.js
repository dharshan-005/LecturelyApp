import express from "express";
import { protect } from "../middleware/auth.js";
import { createLecture, getLectureById, getLectures } from "../controllers/lectureController.js";

const router = express.Router();

router.post("/", protect, createLecture);
router.get("/", protect, getLectures);
router.get("/:id", protect, getLectureById);


export default router;
