import express from "express";
import {v4 as uuid} from "uuid";

import cookieParser from "cookie-parser";
import jwt from "jsonwebtoken";

import User from "../models/user";


const userRouter = express.Router();

const sessions = {};


userRouter.use(cookieParser("secret key"));

// Добавляем нового юзера
userRouter.post("/newUser", async (req, res) => {
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

userRouter.post('/checkAuth', async(req,res) => {
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
  if(doesUserExist) {
    res.status(200).send("User exists")
  } else {
    res.status(401).send('User is not authorized')
  }
})

userRouter.post("/login", async (req, res) => {
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
      res.cookie("set-cookie", token, {
        httpOnly: true,
      });
      res.status(200).send({
        login,
        password,
      })
    }
  } else {
    const user = await new User({
      login: req.body.login,
      password: req.body.password,
    });
    try {
      await user.save()
      res.status(200).send(user)
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
});

// Удаляем куки из обьекта с сессиями
userRouter.post("/logout", (req, res) => {
  res.clearCookie('set-cookie');
  res.status(200).send("you logged out");
});

export{userRouter};
