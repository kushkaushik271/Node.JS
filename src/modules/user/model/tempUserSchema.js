const mongoose = require("mongoose");

const tempUserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    // verificationToken: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: '1h' }
});

module.exports = mongoose.model("TempUser", tempUserSchema);