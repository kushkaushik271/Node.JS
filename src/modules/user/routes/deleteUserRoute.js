const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { verifyToken } = require("../../../../authentication/userAuth");

router.delete("/:userId", verifyToken, userController.deleteUser);

module.exports = router;
