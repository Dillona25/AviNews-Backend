const { Joi, celebrate, Segments } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const userBodyValidator = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": "The minimum length of 'name' is 2 characters",
      "string.max": "The maximum length of 'name' is 30 characters",
      "string.empty": "The 'name' field is required",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "The 'imageUrl' field must be filled in",
      "string.uri": "The 'imageUrl' field must be a valid url",
    }),
    email: Joi.string().required().email().messages({
      "string.empty": "The 'email' field must be filled in",
    }),
    password: Joi.string().required().messages({
      "string.empty": "The 'password' field must be filled in",
    }),
  }),
});

const userAuthenticationValidator = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.empty": "The 'email' field must be filled in",
    }),
    password: Joi.string().required().messages({
      "string.empty": "The 'email' field must be filled in",
    }),
  }),
});

const idValidation = celebrate({
  [Segments.PARAMS]: Joi.object({
    articleId: Joi.string().length(24).hex().required().messages({
      "string.empty": "The 'articleId' field must be filled in",
      "string.length": "The 'articleId' field must have a length of 24",
    }),
  }),
});

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of the "name" field is 2',
      "string.max": 'The maximum length of the "name" field is 30',
      "string.empty": 'The "name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "avatar" field must be filled in',
      "string.uri": 'the "avatar" field must be a valid url',
    }),
  }),
});

const createArticleValidation = celebrate({
  [Segments.BODY]: Joi.object({
    title: Joi.string().required().messages({
      "string.empty": "The 'title' field must be filled in",
    }),
    description: Joi.string().required().messages({
      "string.empty": "The 'text' field must be filled in",
    }),
    publishedAt: Joi.string().required().messages({
      "string.empty": "The 'date' field must be filled in",
    }),
    author: Joi.string().required().messages({
      "string.empty": "The 'author' field must be filled in",
    }),
    url: Joi.string().custom(validateURL).required().messages({
      "string.empty": "The 'link' field must be filled in",
      "string.uri": "The 'link' field must be a valid url",
    }),
    urlToImage: Joi.string().custom(validateURL).required().messages({
      "string.empty": "The 'image' field must be filled in",
      "string.uri": "The 'image' field must be a valid url",
    }),
  }),
});

module.exports = {
  userBodyValidator,
  userAuthenticationValidator,
  idValidation,
  createArticleValidation,
  validateUpdateUser,
};
