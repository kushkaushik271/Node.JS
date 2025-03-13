const errorConstants = require('../constants/error')

const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);

    const statusCode = err.statusCode || errorConstants.INTERNAL_SERVER_ERROR.statusCode;
    const message = err.message || errorConstants.INTERNAL_SERVER_ERROR.message;

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
    // next(err);
};

module.exports = errorHandler