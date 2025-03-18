const express = require('express');
const router = express.Router();
const roleController = require('../controller/roleController');
const { verifyToken, checkAccess } = require('../../../../authentication/userAuth');

router.get('/fetch-roles', verifyToken, checkAccess(['ADMIN', []]), roleController.fetchRoles);

module.exports = router;
