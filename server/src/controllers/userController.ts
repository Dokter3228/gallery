import User, { UserType } from "../models/user";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

export const doesUserExistCheck = async function (
  login: string
): Promise<UserType | null> {
  return User.findOne({ login });
};

class userController {
  async createNewUser(req: Request, res: Response) {
    const { login, password, role } = req.body;
    try {
      const doesUserExist = await doesUserExistCheck(login);

      if (!doesUserExist) {
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
          process.env.JWT_SECRET_KEY!,
          { expiresIn: "15m" }
        );
        res.cookie("token", token, {
          httpOnly: true,
        });

        res.status(200).json(userToSave);
      } else {
        res.status(409).json({ message: "this user already exists" });
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const user = await User.findById(id);

      res.status(200).json(user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      }
    }
  }

  async patchUser(req: Request, res: Response) {
    try {
      const users: UserType[] = req.body;

      const result = [];
      for (let userUpdate of users) {
        const userDb = await User.findById(userUpdate._id);
        if (userUpdate.role && userDb) userDb.role = userUpdate.role;
        if (userUpdate.login && userDb) userDb.login = userUpdate.login;
        userDb && (await userDb.save());
        result.push(userDb);
      }

      res.status(200).json(result);
    } catch (error) {
      if (error instanceof Error) {
        // FIXME 200 on Error
        res.status(200).json({ message: error.message });
      }
    }
  }
}

export default new userController();
