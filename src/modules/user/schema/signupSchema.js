const signupSchema = {
    type: "object",
    properties: {
        username: { type: "string", minLength: 3, maxLength: 30 },
        email: { type: "string", format: "email"},
        password: { type: "string", minLength: 8 }
    },
    required: ["username", "email", "password"],
    additionalProperties: false
};

module.exports = signupSchema;