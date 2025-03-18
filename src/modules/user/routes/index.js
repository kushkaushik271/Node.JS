const express = require('express');
const router = express.Router();
const path = require('path');
const glob = require('glob');

glob.sync(path.join(__dirname, './*.js')).forEach((file) => {
    if (file !== __filename) {
        router.use(require(file));
    }
});

module.exports = router;
