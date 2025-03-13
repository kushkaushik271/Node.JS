const Ajv = require("ajv");
const ajvFormats = require("ajv-formats");

const ajv = new Ajv();
ajvFormats(ajv);

const validateSchema = (schema) => {
    const validate = ajv.compile(schema);
    return (req, res, next) => {
        const valid = validate(req.body);
        if (!valid) {
            return res.status(400).json({ errors: validate.errors });
        }
        next();
    };
};

module.exports = validateSchema;