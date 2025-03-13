const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { verifyRefreshToken } = require("../../../../authentication/userAuth");

router.post("/refresh-token", verifyRefreshToken , userController.refreshToken);

module.exports = router;
