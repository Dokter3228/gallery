import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import { TokenInterface } from "./auth";

export const adminCheckMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token =
      req.headers?.cookie?.split("token=").join("") || req.headers.token;
    const tokenString = Array.isArray(token) ? token.join("") : token;
    const userLogin = (
      jwt.verify(tokenString, process.env.JWT_SECRET_KEY) as TokenInterface
    ).login;
    const user = await User.findOne({ login: userLogin });
    if (user.role === "admin") {
      req.body.role = "admin";
      return next();
    }
    throw new Error("you are not an admin, get fucked");
  } catch (e) {
    res.status(401).json({ message: e.message });
  }
};
