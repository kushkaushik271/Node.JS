const userService = require("../service/userService");
const redisClient = require("../../../lib/redisClient");
const bcrypt = require("bcrypt");
const { STATUS_CODES } = require("../../../constants/constant");
require("dotenv").config();

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await userService.registerUser(username, email, password);
    res
      .status(STATUS_CODES.CREATED)
      .json({ message: "User registered successfully!", user: newUser });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { token, refreshToken, userId } = await userService.loginUser(email, password);

    await redisClient.set(
      `user:${userId}`,
      JSON.stringify({ userId, useremail: email }),
      "EX",
      7200,
    );

    res.setHeader("Authorization", `Bearer ${token}`);
    res.cookie("refreshToken", refreshToken);
    res.status(STATUS_CODES.SUCCESS).json({ message: "User login successfully!" });
  } catch (error) {
    next(error);
  }
};

const resetPassowrd = async (req, res, next) => {
  try {
    const { email } = req.body;
    const response = await userService.requestPasswordReset(email);
    res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { token } = req.params;

    if (!req.user || !req.user.userId) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "Invalid user session." });
    }
    const { newPassword } = req.body;
    let userDetails = await redisClient.get(`user:${req.user.userId}`);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    if (userDetails) {
      userDetails = JSON.parse(userDetails);
      const updateData = await userService.updateById(userDetails?.userId, {
        passwordHash: hashedPassword,
      });

      if (!updateData) {
        return res
          .status(STATUS_CODES.NOT_FOUND)
          .json({ message: "User not found or could not be updated." });
      }
      return res.status(STATUS_CODES.SUCCESS).json({ message: "Password updated successfully." });
    }

    const response = await userService.requestPasswordChange(token, hashedPassword);
    await redisClient.del(`user:${req.user.userId}`);
    res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const response = await userService.deleteUserData(userId);
    res.status(STATUS_CODES.SUCCESS).json(response);
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  try {
    const newAccessToken = await userService.refreshAccessToken(refreshToken);
    res.status(STATUS_CODES.SUCCESS).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(STATUS_CODES.SUCCESS).json(users);
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const users = await userService.emailVerify(token);
    res.status(STATUS_CODES.SUCCESS).json(users);
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const userExists = await redisClient.exists(`user:'${userId}'`);

    if (!userExists) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: "User already logged out" });
    }

    await redisClient.del(`user:${userId}`);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      path: "/",
    });

    res.status(STATUS_CODES.SUCCESS).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

const sendMessageToUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { email } = req.user;
    const { content } = req.body;
    await userService.sendMessageToUser(user_id, email, content);
    res.status(STATUS_CODES.SUCCESS).json({ message: "Message Sent to a user" });
  } catch (error) {
    next(error);
  }
};

const sendGroupMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const senderId = req.user.userId;
    const senderEmail = req.user.email;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    await userService.sendGroupMessage(senderId, senderEmail, content);

    return res.json({ message: "Group message sent successfully!" });
  } catch (error) {
    console.error("Error sending group message:", error);
    return res.status(500).json({ message: "Failed to send group message", error });
  }
};

module.exports = {
  registerUser,
  loginUser,
  resetPassowrd,
  changePassword,
  deleteUser,
  refreshToken,
  getAllUsers,
  verifyEmail,
  logoutUser,
  sendMessageToUser,
  sendGroupMessage,
};
