const express = require("express");
const router = express.Router();
const userPermissionController = require("../controller/roleController");
const { verifyToken, checkAccess } = require("../../../../authentication/userAuth");

router.put(
  "/assignPermissiontoResource",
  verifyToken,
  checkAccess(["ADMIN"], []),
  userPermissionController.assignPermissionToResource,
);

module.exports = router;
