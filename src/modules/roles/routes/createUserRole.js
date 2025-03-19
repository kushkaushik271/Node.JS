const express = require("express");
const router = express.Router();
const userRoleController = require("../controller/roleController");
const { checkAccess, verifyToken } = require("../../../../authentication/userAuth");

router.post(
  "/:userID/roles",
  verifyToken,
  checkAccess(["ADMIN", []]),
  userRoleController.assignRoleToUser,
);

module.exports = router;
