import jwt from "jsonwebtoken";
import { Request, Response } from "express";
class cookieController {
  checkAuth = (req: Request, res: Response) => {
    try {
      const token = req.cookies["set-cookie"];
      console.log(req.cookies);
      let userAuthorized =
        token && jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (typeof userAuthorized !== "string") {
        const { login } = userAuthorized;
        res.status(200).json({
          login,
        });
      } else {
        res.status(401).json({ message: "user is not authorized" });
      }
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  };
}

export default new cookieController();
