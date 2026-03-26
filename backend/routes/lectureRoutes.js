import express from "express";
import { protect } from "../middleware/auth.js";
import { createLecture } from "../controllers/lectureController.js";

const router = express.Router();

router.post("/", protect, createLecture);

export default router;
