import bcrypt from "bcrypt";
import User from "../models/userModels.js";

export const registerUser = async (req, res) => {
  try {
    const { email, password, userName } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      userName,
      oauth: false,
    });

    res.status(201).json({
      email: user.email,
      userName: user.userName,
      image: user.image || "",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    // ❗ Check 1: user exists
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // 🔥 CRITICAL CHECK
    if (user.oauth) {
      return res.status(400).json({
        message: "This account uses Google login. Please sign in with Google.",
      });
    }

    // ❗ Check 2: password exists
    if (!user.password) {
      return res.status(400).json({ message: "Password not set" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      email: user.email,
      userName: user.userName,
      image: user.image || "",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
