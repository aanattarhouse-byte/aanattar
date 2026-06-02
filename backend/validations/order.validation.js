import Joi from 'joi';

export const shippingAddressSchema = Joi.object({
  fullName: Joi.string().required(),
  phone: Joi.string().pattern(/^(\+91)?[6-9]\d{9}$/).required(),
  alternatePhone: Joi.string().pattern(/^(\+91)?[6-9]\d{9}$/).allow('', null),
  line1: Joi.string().required(),
  line2: Joi.string().allow('', null),
  landmark: Joi.string().allow('', null),
  city: Joi.string().required(),
  state: Joi.string().required(),
  pincode: Joi.string().pattern(/^\d{6}$/).required(),
  country: Joi.string().default('India'),
  deliveryInstructions: Joi.string().allow('', null),
  receiverFullName: Joi.string().allow('', null),
  mobileNumber: Joi.string().pattern(/^(\+91)?[6-9]\d{9}$/).allow('', null),
  alternateMobileNumber: Joi.string().pattern(/^(\+91)?[6-9]\d{9}$/).allow('', null),
  houseFlatBuilding: Joi.string().allow('', null),
  streetAreaLocality: Joi.string().allow('', null)
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

export const orderCreateSchema = Joi.object({
  products: Joi.array().items(
    Joi.object({
      id: Joi.string().allow('', null),
      slug: Joi.string().allow('', null),
      name: Joi.string().required(),
      image: Joi.string().allow('', null),
      variant: Joi.string().allow('', null),
      size: Joi.string().allow('', null),
      quantity: Joi.number().integer().min(1).required(),
      price: Joi.number().min(0).required()
    })
  ).min(1).required(),
  amount: Joi.number().min(0).required(),
  shippingAddress: shippingAddressSchema.required(),
  paymentMethod: Joi.string().valid('COD', 'Razorpay').default('COD'),
  paymentStatus: Joi.string().valid('Pending', 'Paid', 'Failed', 'Refunded'),
  paymentDetails: Joi.object().unknown(true)
});

export const checkoutRazorpayCreateSchema = orderCreateSchema.keys({
  paymentMethod: Joi.string().valid('Razorpay').default('Razorpay'),
  paymentStatus: Joi.string().valid('Pending').default('Pending'),
  localOrderId: Joi.string().allow('', null)
});

export const checkoutRazorpayVerifySchema = orderCreateSchema.keys({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required()
});
