const express = require("express");
const router = express.Router();
const userPermissionController = require("../controller/roleController");
const { verifyToken, checkAccess } = require("../../../../authentication/userAuth");

router.put(
  "/userpermissions",
  verifyToken,
  checkAccess(["ADMIN"], []),
  userPermissionController.assignPermissionToUser,
);

module.exports = router;
