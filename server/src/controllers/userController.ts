import User from "../models/user";
import jwt from "jsonwebtoken";

const doesUserExistCheck = async function (login, password) {
  const doesUserExist = await User.findOne(
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
  return doesUserExist;
};

class userController {
  async createNewUser(req, res) {
    const { login, password } = req.body;
    const doesUserExist = await doesUserExistCheck(login, password);
    if (!doesUserExist) {
      const user = new User({
        login: req.body.login,
        password: req.body.password,
      });
      try {
        const userToSave = await user.save();
        const token = jwt.sign(
          {
            login,
            password,
          },
          process.env.JWT_SECRET_KEY,
          { expiresIn: "15m" }
        );
        res.cookie("set-cookie", token);
        res.status(200).json(userToSave);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    } else {
      res.status(301).json({ message: "this user already exists" });
    }
  }

  async login(req, res) {
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
        res.cookie("set-cookie", token);
        res.status(200).send({
          login,
          password,
        });
      } catch (e) {
        console.log(e);
        res.status(400).json({ message: e.message });
      }
    } else {
      res.status(401).json({ message: "you are not signed up" });
    }
  }

  async currentUser(req, res) {
    try {
      const token = req.cookies["set-cookie"];
      let userAuthorized =
        token && jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (userAuthorized) {
        // @ts-ignore
        const { login } = userAuthorized;
        res.status(200).json({
          author: login,
        });
      } else {
        res.status(400).json({ message: "user is not authorized" });
      }
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  }

  async logout(req, res) {
    res.clearCookie("set-cookie");
    res.status(200).json({
      message: "you logged out",
    });
  }
}

export default new userController();
