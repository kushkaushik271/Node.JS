const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const validateSignup = require("../../../../middleware/validationMiddleware");
const signupSchema = require("../schema/signupSchema");

router.post("/signup",validateSignup(signupSchema), userController.registerUser);

module.exports = router;

