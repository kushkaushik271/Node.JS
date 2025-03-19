const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { verifyToken, checkAccess } = require("../../../../authentication/userAuth");

router.delete("/:userId", verifyToken, checkAccess(["ADMIN"], []), userController.deleteUser);

module.exports = router;
