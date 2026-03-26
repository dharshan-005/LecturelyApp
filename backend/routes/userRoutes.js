import express from "express";
import { getUserProfile, syncUser } from "../controllers/userController.js";
import { upload } from "../middleware/upload.js";
import User from "../models/userModels.js";
import { protect } from "../middleware/auth.js";
// import { syncUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/sync", syncUser);
router.get("/profile", protect, getUserProfile);
router.patch(
  "/upload-avatar",
  protect,
  upload.single("avatar"),
  async (req, res) => {
    try {
      const email = req.user.email;

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;

      const user = await User.findOneAndUpdate(
        { email },
        { image: imageUrl },
        { new: true },
      );

      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  },
);

export default router;
