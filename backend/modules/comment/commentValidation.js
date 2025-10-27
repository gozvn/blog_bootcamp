const commentValidation = {
    create : {
        content: {
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
        },
        user_id: {
            in :['body'],
            isNumber :{
                errorMessage: 'validation.required',
            },
            notEmpty: {
                errorMessage: 'validation.required',
            },
        },
        post_id: {
            in :['body'],
            isInteger :{
                errorMessage: 'validation.required',
            },
            notEmpty: {
                errorMessage: 'validation.required',
            },
        }
    }

}

module.exports = commentValidation ;