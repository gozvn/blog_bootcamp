const tagValidation = {
    create: {
        name: {
            in: ["body"],
            isString: {
                errorMessage: "validation.required",
            },
            notEmpty: {
                errorMessage: "validation.required",
            },
        },
    },
    update: {
        name: {
            in: ["body"],
            optional: true,
            isString: {
                errorMessage: "validation.string",
            },
        },
    },
};

module.exports = tagValidation;