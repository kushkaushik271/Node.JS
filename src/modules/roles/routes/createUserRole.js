const express = require("express");
const router = express.Router();
const userRoleController = require("../controller/roleController");

router.post("/:userID/roles", userRoleController.assignRoleToUser);

module.exports = router;
