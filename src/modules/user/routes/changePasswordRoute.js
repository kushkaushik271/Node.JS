const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.patch("/reset-password/:token", userController.changePassword);

module.exports = router;
