const express = require("express");
const router = express.Router();
const roleController = require("../controller/roleController");
const { verifyToken } = require("../../../../authentication/userAuth");

router.post("/", verifyToken, roleController.registerRole);

module.exports = router;

