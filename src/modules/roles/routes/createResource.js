const express = require("express");
const router = express.Router();
const roleController = require("../controller/roleController");
const { verifyToken, checkAccess } = require("../../../../authentication/userAuth");

router.post("/resources", verifyToken, checkAccess(["ADMIN"], []), roleController.createResources);

module.exports = router;
