const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { verifyToken, checkAccess } = require("../../../../authentication/userAuth");

router.post("/logout", verifyToken, userController.logoutUser);

module.exports = router;
