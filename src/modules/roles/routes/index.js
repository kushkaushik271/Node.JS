const express = require("express");
const roleRouter = express.Router();
const path = require("path");
const glob = require("glob");

glob.sync(path.join(__dirname, "./*.js")).forEach((file) => {
  if (file !== __filename) {
    roleRouter.use(require(file));
  }
});

module.exports = roleRouter;
