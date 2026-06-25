import ApiError from './apiError.js';

export const MIN_PRODUCTS = 2;
export const MIN_AMOUNT = 797;
export const MINIMUM_ORDER_MESSAGE = 'Minimum 2 products and ₹797 subtotal required to place an order.';

export const getOrderSubtotal = (products) =>
  products.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

export const assertMinimumOrder = (products, subtotal = getOrderSubtotal(products)) => {
  if (!Array.isArray(products) || products.length < MIN_PRODUCTS || subtotal < MIN_AMOUNT) {
    throw new ApiError(400, MINIMUM_ORDER_MESSAGE);
  }
};
