const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");

router.post("/reset-password", userController.resetPassowrd);

module.exports = router;
