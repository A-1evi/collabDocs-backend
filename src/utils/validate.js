const Joi = require("joi");

const validateSignupData = (data) => {
    const schema = Joi.object({
        name: Joi.string()
            .trim()
            .min(3)
            .max(30)
            .pattern(/^[a-zA-Z0-9\s]+$/)
            .required()
            .messages({
                'string.empty': 'Name is required',
                'string.min': 'Name must be at least 3 characters long',
                'string.max': 'Name cannot exceed 30 characters',
                'string.pattern.base': 'Name can only contain letters, numbers, and spaces'
            }),

        email: Joi.string()
            .trim()
            .lowercase()
            .email()
            .required()
            .messages({
                'string.empty': 'Email is required',
                'string.email': 'Please enter a valid email address'
            }),

        password: Joi.string()
            .min(6)
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
            .required()
            .messages({
                'string.empty': 'Password is required',
                'string.min': 'Password must be at least 6 characters long',
                'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
            })
    });

    return schema.validate(data, { abortEarly: false });
};

const validateLoginData = (data) => {
    const schema = Joi.object({
        email: Joi.string()
            .trim()
            .lowercase()
            .email()
            .required()
            .messages({
                'string.empty': 'Email is required',
                'string.email': 'Please enter a valid email address'
            }),

        password: Joi.string()
            .required()
            .messages({
                'string.empty': 'Password is required'
            })
    });

    return schema.validate(data, { abortEarly: false });
};

module.exports = { validateSignupData, validateLoginData };