import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

export interface TokenInterface {
  login: string;
  password: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const token =
      req.headers?.cookie?.split("token=").join("") || req.headers.token;
    const tokenString = Array.isArray(token) ? token.join("") : token;
    req.body.user = (
      jwt.verify(tokenString, process.env.JWT_SECRET_KEY) as TokenInterface
    ).login;
    next();
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
};
