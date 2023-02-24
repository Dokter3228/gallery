import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token =
      req.headers?.cookie?.split("set-cookie=").join("") ||
      req.headers["set-cookie"][0];
    jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
};
