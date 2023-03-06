import jwt from 'jsonwebtoken';
import { type NextFunction, type Request, type Response } from 'express';
import { type JwtWithLogin } from './admin';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const token = req.headers?.cookie?.split('token=').join('') ?? (req.headers.token as string);
    const tokenString = Array.isArray(token) ? token.join('') : token;

    const jwtPayload = jwt.decode(tokenString, { json: true }) as JwtWithLogin;
    if ('login' in jwtPayload) {
      req.body.user = jwtPayload.login;
    }
    next();
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    }
  }
};
