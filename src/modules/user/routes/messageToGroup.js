const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { verifyToken, checkAccess } = require("../../../../authentication/userAuth");

router.post(
  "/messageToGroup",
  verifyToken,
  checkAccess(["USER", "ADMIN"], [], []),
  userController.sendGroupMessage,
);

module.exports = router;
