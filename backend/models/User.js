const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["student", "worker", "admin"],
    required: true
  },
  name: {
    type: String,
    required: true
  },
  department: {
    type: String,
    default: null
  },
  hostel: {
    type: String,
    default: null
  },
  room: {
    type: String,
    default: null
  },
  contactNumber: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre("save", async function() {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
