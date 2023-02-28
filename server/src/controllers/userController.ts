import User from "../models/user";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const doesUserExistCheck = async function (login, password) {
  return await User.findOne(
    { $and: [{ login: login }, { password: password }] },
    (err, res) => {
      if (err) {
        res.status(500).send(err);
        return;
      }
      return true;
    }
  )
    .clone()
    .catch(function (err) {
      console.log(err);
    });
};

class userController {
  async createNewUser(req: Request, res: Response) {
    const { login, password } = req.body;
    const doesUserExist = await doesUserExistCheck(login, password);
    if (!doesUserExist) {
      try {
        const user = new User({
          login,
          password,
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
        res.cookie("set-cookie", token, {
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

  async login(req: Request, res: Response) {
    const { login, password } = req.body;
    const doesUserExist = await doesUserExistCheck(login, password);
    if (doesUserExist) {
      try {
        const token = jwt.sign(
          {
            login,
            password,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "15m" }
        );
        res.cookie("set-cookie", token, {
          httpOnly: true,
        });
        res.status(200).send(doesUserExist);
      } catch (e) {
        res.status(400).json({ message: e.message });
      }
    } else {
      res.status(401).json({ message: "you are not signed up" });
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

  async logout(req: Request, res: Response) {
    try {
      res.clearCookie("set-cookie");
      res.status(200).json({
        message: "you logged out",
      });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }
}

export default new userController();
