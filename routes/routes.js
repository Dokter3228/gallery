const express = require("express");
const { v4: uuid } = require("uuid");

const User = require("../models/user");

const router = express.Router();

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
    res.status(200).send(sessions);
  }
});

router.get("/getUser/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/getUsers", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
