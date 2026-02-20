const mongoose = require("mongoose");

// Log MongoDB connection state
mongoose.connection.on("connected", () => {
  console.log("MongoDB connected successfully");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err.message);
});
mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  await mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log("MongoDB connected");
};

module.exports = connectDB;
