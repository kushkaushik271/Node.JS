const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const validateSignup = require("../../../../middleware/validationMiddleware");
const loginSchema = require("../schema/loginSchema");

router.post("/login", validateSignup(loginSchema), userController.loginUser);

module.exports = router;
