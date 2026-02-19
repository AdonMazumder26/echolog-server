const express = require("express");
const router = express.Router();
const Memory = require("../models/Memory");
const auth = require("../middleware/authMiddleware");

router.post("/memories", auth, async (req, res) => {
  const memory = new Memory({
    ...req.body,
    userId: req.user.id,
  });
  await memory.save();
  res.json(memory);
});

router.get("/memories", auth, async (req, res) => {
  const memories = await Memory.find({ userId: req.user.id }).sort({
    date: -1,
  });
  res.json(memories);
});

router.get("/memories/:id", auth, async (req, res) => {
  const memory = await Memory.findOne({
    _id: req.params.id,
    userId: req.user.id,
  });
  res.json(memory);
});

router.put("/memories/:id", auth, async (req, res) => {
  const updated = await Memory.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true },
  );
  res.json(updated);
});

router.delete("/memories/:id", auth, async (req, res) => {
  const deleted = await Memory.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.id,
  });

  if (!deleted) return res.status(404).send("Memory not found");
  res.json({ deleted: true, id: deleted._id });
});

module.exports = router;
