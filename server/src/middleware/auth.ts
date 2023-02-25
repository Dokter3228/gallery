import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.cookie.split("=")[1];
    jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
};
