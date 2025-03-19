const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { verifyToken } = require("../../../../authentication/userAuth");

router.patch("/reset-password/:token", verifyToken, userController.changePassword);

module.exports = router;
