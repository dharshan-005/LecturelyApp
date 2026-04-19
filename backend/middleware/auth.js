export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    req.user = { email: token };

    // ✅ Only log in development (optional)
    if (process.env.NODE_ENV === "development") {
      console.log("User:", req.user.email);
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
