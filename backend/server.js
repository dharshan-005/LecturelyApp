import express from "express";
import dotenv from "dotenv";
// import connectDB from "./config/db.js";
import path from "path";

import cors from "cors";
// import subtitleRoute from "./routes/subtitle.js";
import subtitleRouteW from "./routes/wsubtitle.js";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";

import lectureRoutes from "./routes/lectureRoutes.js";

import fetch from "node-fetch";

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api", subtitleRouteW);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);

app.use("/uploads", express.static("uploads"));

app.use("/api/lectures", lectureRoutes);

// app.post("/api/generate", async (req, res) => {
//   const { url, lang } = req.body;

//   const PYTHON_API = process.env.PYTHON_API_URL;

//   try {
//     const response = await fetch(
//       `${PYTHON_API}/generate-from-url?url=${url}&target_lang=${lang}`,
//       { method: "POST" },
//     );

//     const data = await response.json();

//     res.json(data);
//   } catch (error) {
//     res.status(500).json({ error: "Failed to process" });
//   }
// });

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});
