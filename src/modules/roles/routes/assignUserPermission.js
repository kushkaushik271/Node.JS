const express = require("express");
const router = express.Router();
const userPermissionController = require("../controller/roleController");

router.post("/userpermissions", userPermissionController.assignPermissionToUser);

module.exports = router;
