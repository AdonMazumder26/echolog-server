const mongoose = require("mongoose");

const memorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    date: {
      type: Date,
      default: Date.now,
    },

    mood: {
      type: String,
    },

    images: [
      {
        type: String, // store image URLs
      },
    ],

    privacy: {
      type: String,
      enum: ["public", "friends", "private"],
      default: "private",
    },

    tags: [
      {
        type: String,
      },
    ],

    location: {
      type: String,
    },

    shareToken: {
      type: String,
      unique: true,
      sparse: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Memory", memorySchema);
