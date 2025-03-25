const express = require("express");
const router = express.Router();
const roleController = require("../controller/roleController");
const { verifyToken, checkAccess } = require("../../../../authentication/userAuth");

router.post("/", verifyToken, checkAccess(["ADMIN"], []), roleController.registerRole);

module.exports = router;
