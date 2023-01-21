const express = require("express");

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
