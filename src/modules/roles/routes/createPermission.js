const express = require('express');
const router = express.Router();
const roleController = require('../controller/roleController');
const { verifyToken, checkAccess } = require('../../../../authentication/userAuth');

router.post(
  '/permissions',
  verifyToken,
  checkAccess(['ADMIN', []]),
  roleController.createPermission,
);

module.exports = router;
