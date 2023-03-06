import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { doesUserExistCheck } from "./userController";
class authController {
  checkAuth = (req: Request, res: Response) => {
    try {
      const token = req.cookies["token"];
      let userAuthorized =
        token && jwt.verify(token, process.env.JWT_SECRET_KEY!);

      if (typeof userAuthorized !== "string" && userAuthorized !== undefined) {
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

  async login(req: Request, res: Response) {
    const { login, password } = req.body;

    const doesUserExist = await doesUserExistCheck(login);
    if (doesUserExist) {
      try {
        const token = jwt.sign(
          {
            login,
            password,
          },
          process.env.JWT_SECRET_KEY!,
          { expiresIn: "15m" }
        );
        res.cookie("token", token, {
          httpOnly: true,
        });
        res
          .status(200)
          .json({ _id: doesUserExist._id, login: doesUserExist.login });
      } catch (error) {
        if (error instanceof Error) {
          res.status(400).json({ message: error.message });
        }
      }
    } else {
      res.status(401).json({ message: "you are not signed up" });
    }
  }

  async logout(req: Request, res: Response) {
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

export default new authController();
