const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { verifyToken, checkAccess } = require("../../../../authentication/userAuth");

router.post("/logout", verifyToken, checkAccess(["USER", "ADMIN"], []), userController.logoutUser);

module.exports = router;
