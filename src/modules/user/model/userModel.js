const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    isEmailVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String, ref: "User" },
    modifiedBy: { type: String, ref: "User" } 
  },
  { timestamps: true } 
);

const User = mongoose.model("User", userSchema);

module.exports = User;
