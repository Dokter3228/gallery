const express = require("express");
const { v4: uuid } = require("uuid");

const User = require("../models/user");

const router = express.Router();

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

const sessions = {};

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
    const sessionId = uuid();
    sessions[sessionId] = { login, _id };
    res.set("Set-Cookie", `session=${sessionId}`);
    res.status(200).send({
      login,
      password,
    });
  }
});

router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    res.json({ deletedUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
