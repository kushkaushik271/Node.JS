const validator = require("validator");

const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw new Error("Invalid email format.");
  }
};

const validatePassword = (password) => {
  if (!password || password.length < 8) {
    throw new Error("Password must be at least 8 characters long.");
  }

  if (!validator.isStrongPassword(password, { minLength: 8, minNumbers: 1, minUppercase: 1, minSymbols: 1 })) {
    throw new Error("Password must contain at least one uppercase letter, one number, and one special character.");
  }
};

module.exports = { validateEmail, validatePassword };
