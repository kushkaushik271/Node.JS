const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const { verifyToken, checkAccess } = require("../../../../authentication/userAuth");

router.get("/users", verifyToken, checkAccess(["ADMIN"], []), userController.getAllUsers);

module.exports = router;
