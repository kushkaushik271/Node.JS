const express = require('express');
const router = express.Router();
const userPermissionController = require('../controller/roleController');
const {
  verifyToken,
  checkAccess,
} = require('../../../../authentication/userAuth');

router.post(
  '/userpermissions',
  verifyToken,
  checkAccess(['ADMIN', []]),
  userPermissionController.assignPermissionToUser
);

module.exports = router;
