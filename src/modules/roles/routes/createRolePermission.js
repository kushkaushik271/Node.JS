const express = require("express");
const router = express.Router();
const roleController = require("../controller/roleController");
const { verifyToken, checkAccess } = require("../../../../authentication/userAuth");

router.post(
  "/:roleId/permissions",
  verifyToken,
  checkAccess(["ADMIN", []]),
  roleController.assignPermissionToRole,
);

module.exports = router;
