const mongoose = require("mongoose");
require("dotenv").config({ path: "./config.env" });

async function connectDB() {
  try {
    await mongoose.connect(process.env.CONN_STRING);
    console.log("✅ Connected to MongoDB!");
    process.exit(0);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

connectDB();
