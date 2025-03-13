const express = require("express");
const router = express.Router();

router.use(require("./signupRoute"));
router.use(require("./loginRoute"));
router.use(require("./resetPasswordRoute"));
router.use(require("./changePasswordRoute"));
router.use(require("./deleteUserRoute"));
router.use(require('./refresh-token'));
router.use(require('./getAllUsers'));
router.use(require('./verifyEmail'))

module.exports = router;
