import Joi from 'joi';

export const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  category: Joi.string().required(),
  price: Joi.number().min(0).required(),
  discountPrice: Joi.number().min(0).allow(null),
  images: Joi.array().items(Joi.object({ url: Joi.string().uri(), key: Joi.string() })).default([]),
  stock: Joi.number().integer().min(0).required(),
  featured: Joi.boolean().default(false)
});
