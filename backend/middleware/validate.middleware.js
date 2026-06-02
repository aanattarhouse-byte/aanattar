import ApiError from '../utils/apiError.js';

const validate = (schema) => (req, _res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return next(new ApiError(400, error.details.map((item) => item.message).join(', ')));
  }

  req.body = value;
  next();
};

export default validate;
