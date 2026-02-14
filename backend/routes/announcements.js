const express = require("express");
const Announcement = require("../models/Announcement");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

// Admin posts announcement
router.post("/", authenticate, authorize("admin"), async (req, res) => {
  try {
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
    const announcements = await Announcement.find().sort({ createdAt: -1 });
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete announcements
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    await Announcement.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
