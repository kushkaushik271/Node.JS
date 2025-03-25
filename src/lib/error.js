const errorConstants = require("../constants/error");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || errorConstants.INTERNAL_SERVER_ERROR.statusCode;
  const message = err.message || errorConstants.INTERNAL_SERVER_ERROR.message;

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
};

module.exports = errorHandler;
