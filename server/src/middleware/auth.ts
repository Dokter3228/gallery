import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

declare module "jsonwebtoken" {
  export interface JwtWithLogin extends jwt.JwtPayload {
    login: string;
    password: string;
  }
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

    const jwtPayload = jwt.verify(tokenString!, process.env.JWT_SECRET_KEY!);
    if (typeof jwtPayload !== "string" && "login" in jwtPayload) {
      req.body.user = jwtPayload.login;
    }
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    }
  }
};
