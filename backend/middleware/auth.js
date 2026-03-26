export const protect = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    req.user = { email: token };

    console.log("REQ.USER AFTER SET:", req.user);

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
