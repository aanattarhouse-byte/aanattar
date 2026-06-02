import Joi from 'joi';

export const shippingAddressSchema = Joi.object({
  fullName: Joi.string().required(),
  phone: Joi.string().required(),
  line1: Joi.string().required(),
  line2: Joi.string().allow('', null),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.string().required(),
  country: Joi.string().default('India')
});

export const paymentCreateSchema = Joi.object({
  shippingAddress: shippingAddressSchema.required()
});

export const paymentVerifySchema = Joi.object({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
  shippingAddress: shippingAddressSchema.required()
});
