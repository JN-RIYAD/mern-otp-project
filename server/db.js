const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB); // uses DB from .env
    console.log("✅ Connected to MongoDB Atlas Successfully");
  } catch (error) {
    console.error("❌ Could not connect to MongoDB Atlas:", error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;
