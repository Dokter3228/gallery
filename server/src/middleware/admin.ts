import jwt from 'jsonwebtoken';
import { type NextFunction, type Request, type Response } from 'express';
import User from '../models/user';

declare module 'jsonwebtoken' {
  export interface JwtWithLogin extends jwt.JwtPayload {
    login: string;
  }
}
export const adminCheckMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers?.cookie?.split('token=').join('') || (req.headers.token as string);
    const tokenString = Array.isArray(token) ? token.join('') : token;
    const jwtPayload = <jwt.JwtWithLogin>jwt.verify(tokenString, process.env.JWT_SECRET_KEY);
    if ('login' in jwtPayload) {
      const user = await User.findOne({ login: jwtPayload.login });
      if (user != null) {
        if (user.role === 'admin') {
          req.body.role = 'admin';
          next();
          return;
        }
      }
    }

    throw new Error('you are not an admin, get fucked');
  } catch (error) {
    if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    }
  }
};
