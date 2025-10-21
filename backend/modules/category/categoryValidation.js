const categoryValidation = {
    createCategory: {   
        cat_name: {
            in: ['body'],
            isString: {
                errorMessage: 'Category Name must be a string',
            },
            notEmpty: {
                errorMessage: 'Category Name is required',
            },
            isLength: {
                options: { min: 11 },
                errorMessage: 'Category Name must be more than 10 characters',
            }
        },
        description: {
            in: ['body'],
            isString: {
                
                errorMessage: 'Description must be a string',
            },
            notEmpty: {
                errorMessage: 'Description is required',
            },
            isLength: {
                options: { min: 11 },
                errorMessage: 'Description must be more than 10 characters',
            }
        },
        thumbnail: {
            in: ['body'],
            isString: {
                errorMessage: 'Thumbnail must be a string',
            }
        }
    },



}

module.exports = categoryValidation;