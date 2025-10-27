const languageValidation = {
    create : {
        lang_code: {
            in: ['body'],
            isString: {
                errorMessage: 'validation.required',
            },
            notEmpty: {
                errorMessage: 'validation.required',
            },
            isLength: {
                options: { min: 1 },
                errorMessage: 'validation.required',
            }
        },
        lang_name: {
            in: ['body'],
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
        }
    },  
    update : {
        lang_code: {
            in: ['body'],
            isString: {
                errorMessage: 'validation.required',
            },
            isLength: {
                options: { min: 1 },
                errorMessage: 'validation.required',
            }
        },
        lang_name: {
            in: ['body'],
            isString: {
                errorMessage: 'validation.required',
            },
            isLength: {
                options: { min: 5 },
                errorMessage: 'validation.required',
            }
        }
    }
}

module.exports = languageValidation;