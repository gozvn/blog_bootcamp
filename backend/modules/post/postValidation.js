const postValidation = {
  createPost: {
    title: {
      notEmpty: true,
      isString: true,
      isLength: {
        min: 5,
        max: 100,
      },
      errorMessage: 'Validation.required',
    },
    content: {
      notEmpty: true,
      isString: true,
      isLength: {
        min: 20,
        max: 5000,
      },
      errorMessage: 'Validation.required',
    },
    user_id: {
      notEmpty: true,
      isInt: true,
      errorMessage: 'Validation.required',
    },
    lang_id: {
      notEmpty: true,
      isInt: true,
      errorMessage: 'Validation.required',
    },
    featured: {
      notEmpty: true,
      isBoolean: true,
      errorMessage: 'Validation.required',
    },
    thumbnail: {
      isString: true,
      errorMessage: 'Validation.required',
    },
    status: {
      notEmpty: true,
      isString: true,
      errorMessage: 'Validation.required',
    },
  },
  editPost: {
    title: {
      optional: true,
      isString: true,
      isLength: {
        min: 5,
        max: 100,
      },
      errorMessage: 'Validation.title.required',
    },
    content: {
      optional: true,
      isString: true,
      isLength: {
        min: 10,
        max: 5000,
      },
      errorMessage: 'Validation.content.required',
    },
    lang_id: {
      optional: true,
      isInt: true,
      errorMessage: 'Validation.lang_id.required',
    },
    featured: {
      optional: true,
      isBoolean: true,
      errorMessage: 'Validation.required',
    },
    thumbnail: {
      optional: true,
      isString: true,
      errorMessage: 'Validation.required',
    },
    status: {
      optional: true,
      isString: true,
      errorMessage: 'Validation.required',
    },
  },

};
module.exports = postValidation;