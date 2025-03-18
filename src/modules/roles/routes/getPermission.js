const express = require('express');
const router = express.Router();
const roleController = require('../controller/roleController');
const { verifyToken, checkAccess } = require('../../../../authentication/userAuth');

router.get('/permissions', verifyToken, checkAccess(['ADMIN', []]), roleController.getPermission);

module.exports = router;
