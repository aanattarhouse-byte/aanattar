import mongoose from 'mongoose';

const orderProductSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productId: String,
  slug: String,
  name: String,
  image: String,
  variant: String,
  size: String,
  volume: String,
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  products: [orderProductSchema],
  amount: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Pending', 'Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Razorpay'],
    default: 'COD'
  },
  paymentDetails: { type: Object },
  shippingAddress: { type: Object, required: true },
  razorpayOrderId: String,
  razorpayPaymentId: String
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
