const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/verify-email", userController.verifyEmail);

module.exports = router;
