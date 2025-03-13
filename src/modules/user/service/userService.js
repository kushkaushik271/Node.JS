const User = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendResetPasswordEmail, sendVerificationEmail } = require("../../../services/emailService");
const { validateEmail, validatePassword } = require('../../../lib/validations');
const tempUser = require("../model/tempUserSchema");
require("dotenv").config();

const registerUser = async (username, email, password) => {
    validateEmail(email)
    validatePassword(password)

    const existingUser = await tempUser.findOne({email})
    if (existingUser) {
        throw new Error("User already exists with this email.");
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new tempUser({
        username,
        email,
        passwordHash
    });

    await newUser.save();

    const verificationToken = jwt.sign(
        { email, userId: newUser._id }, 
        process.env.JWT_SECRET, 
        { expiresIn: '1h' }
    );

    console.log(verificationToken)

    await sendVerificationEmail(email, verificationToken);

    return { message: "Registration successful! Please check your email to verify your account." , verificationToken };
};

const emailVerify = async (token) => {
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log({decoded})
        const temperoryUser = await tempUser.findOne({ email: decoded.email });
        if (!temperoryUser) {
            return res.status(400).json({ message: "Invalid or expired token." });
        }
        console.log({temperoryUser})
        // Create the user in the original collection
        const newUser = new User({
            username: temperoryUser.username,
            email: temperoryUser.email,
            passwordHash: temperoryUser.passwordHash,
        });

        await newUser.save();

        await tempUser.deleteOne({ email: decoded.email });

        return { message: "Email verified successfully! You can now log in." };
    } catch (error) {
       throw new Error(error)
    }
}

const loginUser = async (email, password) => {
    validateEmail(email)
    validatePassword(password)
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("Invalid email or password.");
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new Error("Invalid email or password.");
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    const refreshToken = jwt.sign({ userId: user._id, email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN });
    return { token, refreshToken };
}

const requestPasswordReset = async (email) => {
    validateEmail(email)
    const user = await User.findOne({ email });
    if (!user) {
        throw new Error("User with this email does not exist.");
    }

    const resetToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    );

    await sendResetPasswordEmail(email, resetToken);

    return { message: "Password reset link sent to email." };
};


const requestPasswordChange = async (token, newPassword) => {
    try {
        validatePassword(newPassword)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId;

        const user = await User.findById(userId);
        if (!user) {
            throw new Error("User not found.");
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);

        await user.save();
        return { message: "Password reset successful. You can now log in." };
    } catch (error) {
        throw new Error("Invalid or expired token.");
    }
};

const deleteUserData = async(userId) => {
    try {
        await User.findByIdAndDelete(userId);
        return {message : 'User Deleted Successfully'}
    }catch(error){
        throw new Error(error)
    }
}

const refreshAccessToken = async (refreshToken) => {

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    console.log('i am decoded refresh token' , decoded)
    const user = await User.findById(decoded.userId);
    if (!user) {
        throw new Error("Invalid refresh token.");
    }

    const newAccessToken = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    return newAccessToken;
};

const getAllUsers = async () => {
    try {
        const users = await User.find({}, '_id username email');
        return users;
    } catch (error) {
        throw new Error("Error fetching users.");
    }
};


module.exports = { registerUser, loginUser, requestPasswordReset, requestPasswordChange, deleteUserData, refreshAccessToken, getAllUsers, emailVerify };
