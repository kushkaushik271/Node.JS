const errorConstants = {
    NOT_FOUND: {
        statusCode: 404,
        message: "Resource not found",
    },
    UNAUTHORIZED: {
        statusCode: 401,
        message: "Unauthorized access",
    },
    FORBIDDEN: {
        statusCode: 403,
        message: "Forbidden access",
    },
    BAD_REQUEST: {
        statusCode: 400,
        message: "Bad request",
    },
    INTERNAL_SERVER_ERROR: {
        statusCode: 500,
        message: "Internal server error",
    },
    VALIDATION_ERROR: {
        statusCode: 422,
        message: "Validation error",
    },
};

module.exports = errorConstants

// pending table with jwt auth. for signup.
// email should be time val.