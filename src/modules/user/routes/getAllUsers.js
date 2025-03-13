const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { verifyToken } = require("../../../../authentication/userAuth");

router.get("/users", verifyToken, userController.getAllUsers);

module.exports = router;