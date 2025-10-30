const { User } = require('../../models');
const unique = require('../../kernels/validations/uniqueValidator');
const userValidation = {
    // Define validation schemas for user-related operations here
    createUser: {
        // Validation rules for creating a user
        username: {
            in: ['body'],
            isString: true,
            notEmpty: true,
            custom: unique(User, 'username', 'validation.required'),
            isLength: {
                options: { min: 3 },
            },
            errorMessage: 'Validation.required',
        },
        email: {
            in: ['body'],
            isEmail: true,
            notEmpty: true,
            errorMessage: 'Validation.required',
        },
        password: {
            in: ['body'],
            isLength: {
                options: { min: 6 },
            },
            errorMessage: 'Validation.required',
        },
    },
    updateUser: {
        // Validation rules for updating a user
        username: {
            in: ['body'],
            optional: true,
            isString: true,
            isLength: {
                options: { min: 3 },
            },
            notEmpty: true,
            errorMessage: 'Validation.required',
        },
        email: {
            in: ['body'],
            optional: true,
            isEmail: true,
            isLength: {
                options: { min: 6 },
            },
            errorMessage: 'Validation.required',
        },
    },
    deleteUser: {
        // Validation rules for deleting a user
    }
};

module.exports = userValidation;