const express = require("express");
const Announcement = require("../models/Announcement");
const { authenticate, authorize } = require("../middleware/auth");
const { isDBConnected } = require("../db");

const router = express.Router();

const fallbackAnnouncements = [];
const generateFallbackId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// Admin posts announcement
router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    if (!req.body.text) {
      return res.status(400).json({ message: "Text is required" });
    }

    if (!isDBConnected()) {
      const announcement = {
        _id: generateFallbackId(),
        text: req.body.text,
        createdAt: new Date().toISOString(),
      };
      fallbackAnnouncements.unshift(announcement);
      return res.json(announcement);
    }

    const a = new Announcement({ text: req.body.text });
    await a.save();
    res.json(a);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Student fetches announcements
router.get("/", authenticate, async (req, res) => {
  try {
    if (!isDBConnected()) {
      return res.json(fallbackAnnouncements);
    }

    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete announcements
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    if (!isDBConnected()) {
      const index = fallbackAnnouncements.findIndex(a => a._id === req.params.id);
      if (index !== -1) {
        fallbackAnnouncements.splice(index, 1);
      }
      return res.json({ message: "Deleted successfully" });
    }

    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
