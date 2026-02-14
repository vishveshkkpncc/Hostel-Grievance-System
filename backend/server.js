const express = require("express");
const cors = require("cors");
const connectDB = require("./db");

// Routes
const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaints");
const announcementRoutes = require("./routes/announcements");

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/complaints", complaintRoutes);
app.use("/api/announcements", announcementRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
