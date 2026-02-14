const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

const { authenticate } = require("../middleware/auth");

// Login
router.post("/login", async (req, res) => {
  try {
    const { userId, password, person } = req.body;

    if (!userId || !password || !person) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Normalize role to lowercase for comparison
    const normalizedRole = person.toLowerCase();
    
    // First find user by userId only
    const user = await User.findOne({ userId: userId });
    
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials - User not found" });
    }

    // Check if role matches (case-insensitive)
    if (user.role.toLowerCase() !== normalizedRole) {
      return res.status(401).json({ 
        message: `Invalid credentials - Role mismatch. User role is '${user.role}', but you selected '${person}'` 
      });
    }

    const isMatch = await user.comparePassword(password);
    
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
    res.status(500).json({ error: error.message });
  }
});

// Register (for initial setup - can be removed in production)
router.post("/register", async (req, res) => {
  try {
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
    const user = await User.findOne({ userId: decoded.userId }).select("-password");

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
    const user = await User.findOne({ userId: decoded.userId });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await user.comparePassword(oldPassword);
    if (!isMatch) return res.status(401).json({ message: "Old password incorrect" });

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

