const userService = require('../service/userService');

const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const newUser = await userService.registerUser(username, email, password);
    res.status(201).json({ message: 'User registered successfully!', user: newUser });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const loginData = await userService.loginUser(email, password);
    res.status(200).json({ message: 'User login successfully!', user: loginData });
  } catch (error) {
    next(error);
  }
};

const resetPassowrd = async (req, res, next) => {
  try {
    const { email } = req.body;
    const response = await userService.requestPasswordReset(email);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const response = await userService.requestPasswordChange(token, newPassword);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const response = await userService.deleteUserData(userId);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  try {
    const newAccessToken = await userService.refreshAccessToken(refreshToken);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    const users = await userService.emailVerify(token);
    res.status(200).json(users);
  } catch (error) {
    next(error);
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
};
