const express = require("express");
const router = express.Router();
const roleController = require("../controller/roleController");

router.post("/:roleId/permissions", roleController.assignPermissionToRole);

module.exports = router;

