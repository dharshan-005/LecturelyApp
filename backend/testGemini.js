// testGemini.js
import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const run = async () => {

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "Translate hello to Tamil"
  });

  console.log(response.text);

};

run();