const express = require("express");
const router = express.Router();
const userRoleController = require("../controller/roleController");
const { verifyToken } = require("../../../../authentication/userAuth");

router.delete("/users/:userId/roles/:roleId", verifyToken, userRoleController.removeRoleFromUser);

module.exports = router;
