import express from "express";
import {v4 as uuid} from "uuid";

import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";
import User from "../models/user";

const router = express.Router();

const sessions = {};

router.use(cookieParser("secret key"));
// Добавляем нового юзера
router.post("/newUser", async (req, res) => {
  const user = new User({
    login: req.body.login,
    password: req.body.password,
  });

  try {
    const userToSave = await user.save();
    res.status(301).json(userToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Проверяем находится ли заданный юзер в базе данных. Если да, то генерируем куки, задаем их ему в браузер и сохраняем к себе в обьект с сессиями.
router.post("/login", async (req, res) => {
  const { login, password, _id } = req.body;
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
  if (doesUserExist) {
    const token = req.cookies.token;
    let user;
    if (token) {
      user = jwt.verify(token, "hellosecret");
    }
    if (user) {
      res.json({
        login, password
      })
    } else {
      const token = jwt.sign(
        {
          login,
          password,
        },
        "hellosecret",
        { expiresIn: "15m" }
      );
      res.cookie("token", token, {
        httpOnly: true,
      });
      res.status(200).json({
        login,
        password,
      })
    }
  } else {
    const user = new User({
      login: req.body.login,
      password: req.body.password,
    });
    try {
      const userToSave = await user.save();
      res.status(200).json(userToSave);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

// Удаляем куки из обьекта с сессиями
router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).send("you logged out");
});

router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.json({ deletedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export{router};
