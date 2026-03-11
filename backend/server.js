import express from "express";
import dotenv from "dotenv";
// import connectDB from "./config/db.js";

import cors from "cors";
// import subtitleRoute from "./routes/subtitle.js";
import subtitleRouteW from "./routes/wsubtitle.js";

dotenv.config();
const app = express();
app.use(cors());

app.use("/api", subtitleRouteW);

app.use("/uploads", express.static("uploads"));

// connectDB();

// app.get('/', (req,res) => {
//     res.send("Api is running...")
// })

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
  // console.log("Gemini key:", process.env.GEMINI_API_KEY);
  // console.log()
});
