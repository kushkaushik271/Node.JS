const express = require("express");
const router = express.Router();
const roleController = require("../controller/roleController");
const { verifyToken, checkAccess } = require("../../../../authentication/userAuth");

router.get("/getAllRoles", verifyToken, checkAccess(["ADMIN"], []), roleController.getRole);

module.exports = router;
