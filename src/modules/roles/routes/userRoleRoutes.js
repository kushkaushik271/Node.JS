const express = require("express");
const router = express.Router();
const userRoleController = require("../controller/roleController");
const { verifyToken, checkAccess } = require("../../../../authentication/userAuth");

router.delete(
  "/users/:userId/roles/:roleId",
  verifyToken,
  checkAccess(["ADMIN", []]),
  userRoleController.removeRoleFromUser,
);

module.exports = router;
