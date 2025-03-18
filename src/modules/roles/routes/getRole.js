const express = require("express");
const router = express.Router();
const roleController = require("../controller/roleController");
const { verifyToken } = require("../../../../authentication/userAuth");

router.post("/getAllRoles?", verifyToken, roleController.getRole);

module.exports = router;


// need to modify with query perameters.