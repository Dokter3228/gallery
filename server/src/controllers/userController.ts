import User from "../models/user";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export const doesUserExistCheck = async function (login) {
  return User.findOne({ login: login });
};

class userController {
  async createNewUser(req: Request, res: Response) {
    const { login, password, role } = req.body;
    const doesUserExist = await doesUserExistCheck(login);
    if (!doesUserExist) {
      try {
        const user = new User({
          login,
          password,
          role,
        });
        const userToSave = await user.save();
        const token = jwt.sign(
          {
            login,
            password,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "15m" }
        );
        res.cookie("token", token, {
          httpOnly: true,
        });
        res.status(200).json(userToSave);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    } else {
      res.status(409).json({ message: "this user already exists" });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const user = await User.findById(id);
      res.status(200).json(user);
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

export default new userController();
