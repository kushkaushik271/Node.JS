const mongoose = require("mongoose");
const config = require("../config/default");

const { DB_URI } = config;

const dbConnection = async () => {
  try {
    await mongoose.connect(DB_URI);
    /* eslint-disable */
    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.log("MongoDB Connection Error:", err);
    throw new Error(err)
  }
};

module.exports = dbConnection;
