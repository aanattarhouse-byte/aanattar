import Joi from 'joi';

export const userStatusSchema = Joi.object({
  blocked: Joi.boolean().required()
});
