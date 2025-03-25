const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { verifyToken, checkAccess } = require("../../../../authentication/userAuth");

router.post(
  "/single/:user_id",
  verifyToken,
  checkAccess(["USER", "ADMIN"], [], []),
  userController.sendMessageToUser,
);

module.exports = router;
