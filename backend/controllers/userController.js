import User from "../models/userModels.js";

export const getUserProfile = async (req, res) => {
  try {
    console.log("User:", req.user);

    const email = req.user.email;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    console.log("DB User:", user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.lastCreditRefresh) {
      user.lastCreditRefresh = new Date();
      await user.save();
    }

    const now = new Date();
    const last = new Date(user.lastCreditRefresh);

    const diffInDays = Math.floor(
      (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diffInDays >= 1) {
      user.stats.creditsRemaining = user.stats.totalCredits;
      user.lastCreditRefresh = now;
      await user.save();
    }

    res.json({
      userName: user.userName,
      image: user.image,
      stats: user.stats,
      recentLectures: user.recentLectures,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const syncUser = async (req, res) => {
  try {
    const { email, userName, image } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        userName,
        image,
        oauth: true,
      });
    } else {
      // Keep data updated (important for Google login changes)
      if (userName) user.userName = userName;
      if (image) user.image = image;
      await user.save();
    }

    res.status(200).json({ message: "User synced", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
