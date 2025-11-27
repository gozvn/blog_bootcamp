const unique = require('../../kernels/validations/uniqueValidator');
const { Category } = require('../../models');

const categoryValidation = {
    createCategory: {
        name: {
            in: ['body'],
            isString: {
                errorMessage: 'validation.required',
            },
            custom: unique(Category, 'name', 'validation.required'),
            notEmpty: {
                errorMessage: 'validation.required',
            },
            isLength: {
                options: { min: 5 },
                errorMessage: 'validation.required',
            }
        },
        description: {
            in: ['body'],
            optional: true,
            isString: {
                errorMessage: 'validation.required',
            },
            isLength: {
                options: { min: 11 },
                errorMessage: 'validation.required',
            }
        },
        thumbnail: {
            optional: true,
            in: ['body'],
            isString: {
                errorMessage: 'validation.required',
            }
        }
    },
    updateCategory: {
        name: {
            in: ['body'],
            optional: true,
            isString: {
                errorMessage: 'validation.required',
            },
            notEmpty: {
                errorMessage: 'validation.required',
            },
            isLength: {
                options: { min: 5 },
                errorMessage: 'validation.required',
            }
        },
        description: {
            in: ['body'],
            optional: true,
            isString: {
                errorMessage: 'validation.required',
            },
            isLength: {
                options: { min: 11 },
                errorMessage: 'validation.required',
            }
        },
        thumbnail: {
            in: ['body'],
            optional: true,
            isString: {
                errorMessage: 'validation.required',
            }
        }
    }
}

module.exports = categoryValidation;