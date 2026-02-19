const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/auth/register", async (req, res) => {
  const { name, email, password, avatar } = req.body;

  try {
    const hashed = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashed,
      avatar: avatar || "",
    });
    await user.save();
    res.json({
      created: true,
      user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    });
  } catch (err) {
    res.status(400).send(err?.message || "Registration failed");
  }
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).send("User not found");

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).send("Wrond password");

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar },
  });
});

router.get("/profile", authMiddleware, (req, res) => {
  User.findById(req.user.id)
    .select("name email avatar")
    .then((user) => {
      if (!user) return res.status(404).send("User not found");
      res.json({ user: { id: user._id, name: user.name, email: user.email, avatar: user.avatar } });
    })
    .catch((err) => res.status(500).send(err?.message || "Failed to load profile"));
});

module.exports = router;
