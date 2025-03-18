const express = require("express");
const router = express.Router();
const roleController = require("../controller/roleController");
const { verifyToken } = require("../../../../authentication/userAuth");

router.post("/permissions", roleController.createPermission);

module.exports = router;

