const mongoose = require("mongoose");

let dbConnected = false;
const useMockData = process.env.USE_MOCK_DATA !== "false";

const connectDB = async () => {
  if (useMockData) {
    console.warn("Using hardcoded mock data. Set USE_MOCK_DATA=false to enable MongoDB.");
    dbConnected = false;
    return;
  }

  try {
    const mongoURI = process.env.MONGODB_URI || "mongodb+srv://admin:greeshma@cluster0.n3bvco9.mongodb.net/hostelGrievance";
    
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log("✅ MongoDB connected successfully");
    dbConnected = true;
  } catch (error) {
    console.warn("⚠️ MongoDB connection failed:", error.message);
    console.warn("📝 Using hardcoded mock users for development/testing");
    dbConnected = false;
  }
};

const isDBConnected = () => dbConnected && mongoose.connection.readyState === 1;

module.exports = { connectDB, isDBConnected };
