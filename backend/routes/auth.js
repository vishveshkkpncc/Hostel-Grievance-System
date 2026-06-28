const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const mockUsers = require("../mockUsers");
const { isDBConnected } = require("../db");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

const { authenticate } = require("../middleware/auth");

// Helper function to find user from DB or mock users
const findUser = async (userId) => {
  if (isDBConnected()) {
    return await User.findOne({ userId });
  }
  return mockUsers.find(u => u.userId === userId);
};

// Helper function to compare password
const comparePassword = (user, candidatePassword) => {
  console.log("🔐 Password comparison:");
  console.log("   Candidate:", typeof candidatePassword, candidatePassword);
  console.log("   Stored:", typeof user.password, user.password);
  
  if (user.comparePassword) {
    // MongoDB user - this will be async, need to await
    console.log("   Using bcrypt (DB user)");
    return user.comparePassword(candidatePassword);
  } else {
    // Mock user - simple string comparison
    console.log("   Using plain text (mock user)");
    const match = String(user.password) === String(candidatePassword);
    console.log("   Match result:", match);
    return Promise.resolve(match);
  }
};

// Login
router.post("/login", async (req, res) => {
  try {
    const { userId, password, person } = req.body;

    if (!userId || !password || !person) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Normalize role to lowercase for comparison
    const normalizedRole = person.toLowerCase();
    
    // Find user from DB or mock users
    const user = await findUser(userId);
    
    console.log("🔍 Login attempt:", { userId, password, person });
    console.log("👤 User found:", user ? `${user.name} (${user.role})` : "NOT FOUND");
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials - User not found" });
    }

    // Check if role matches (case-insensitive)
    if (user.role.toLowerCase() !== normalizedRole) {
      return res.status(401).json({ 
        message: `Invalid credentials - Role mismatch. User role is '${user.role}', but you selected '${person}'` 
      });
    }

    console.log("🔐 Comparing passwords...");
    console.log("   Provided:", password);
    console.log("   Stored:", user.password);
    
    const isMatch = await comparePassword(user, password);
    
    console.log("✓ Password match:", isMatch);
    
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials - Password incorrect" });
    }

    const token = jwt.sign(
      { 
        userId: user.userId, 
        role: user.role,
        name: user.name 
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    console.log("✅ Login successful for:", userId);
    
    res.json({
      token,
      user: {
        userId: user.userId,
        role: user.role,
        name: user.name,
        department: user.department,
        room: user.room,
        hostel: user.hostel,
        contactNumber: user.contactNumber
      }
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Register (for initial setup - can be removed in production)
router.post("/register", async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.status(503).json({ message: "Database not connected. Registration not available. Use existing test users for now." });
    }

    const { userId, password, role, name, department, hostel, room, contactNumber } = req.body;

    const existingUser = await User.findOne({ userId });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({
      userId,
      password,
      role,
      name,
      department,
      hostel,
      room,
      contactNumber
    });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current user
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await findUser(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return full profile (excluding password)
    res.json({
      userId: user.userId,
      role: user.role,
      name: user.name,
      department: user.department,
      hostel: user.hostel,
      room: user.room,
      contactNumber: user.contactNumber
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
});

// Change password
router.put("/change-password", authenticate, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Both old and new passwords are required" });
    }

    const decoded = jwt.verify(req.headers.authorization.split(" ")[1], JWT_SECRET);
    const user = await findUser(decoded.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await comparePassword(user, oldPassword);
    if (!isMatch) return res.status(401).json({ message: "Old password incorrect" });

    // Only allow password change for DB users
    if (!isDBConnected()) {
      return res.status(503).json({ message: "Database not connected. Password change not available." });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

