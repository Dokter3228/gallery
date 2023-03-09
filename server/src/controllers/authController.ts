import jwt from "jsonwebtoken";
import { type Request, type Response } from "express";
import { doesUserExistCheck } from "./userController";
import { jwtSecretKey } from "../index";

class AuthController {
  checkAuth = (req: Request, res: Response): void => {
    try {
      const token = req.cookies.token;
      const userAuthorized = jwt.verify(token, jwtSecretKey) as {
        login: string;
      };
      if ("login" in userAuthorized) {
        const { login } = userAuthorized;
        res.status(200).json({
          login,
        });
      } else {
        res.status(401).json({ message: "user is not authorized" });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  };

  async login(req: Request, res: Response): Promise<void> {
    const { login, password } = req.body;

    const doesUserExist = await doesUserExistCheck(login);
    if (doesUserExist != null) {
      try {
        const token = jwt.sign(
          {
            login,
            password,
          },
          jwtSecretKey,
          { expiresIn: "15m" }
        );
        res.cookie("token", token, {
          httpOnly: true,
        });
        res.status(200).json({ _id: doesUserExist._id, login: doesUserExist.login });
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ message: error.message });
        }
      }
    } else {
      res.status(401).json({ message: "you are not signed up" });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      res.clearCookie("token");
      res.status(200).json({ message: "logged out" });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }
}

export default new AuthController();
