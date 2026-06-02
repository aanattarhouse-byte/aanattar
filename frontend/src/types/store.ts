export type UserRole = 'user' | 'admin';
export type OrderStatus = 'Pending' | 'Processing' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed' | 'Refunded';

export type Address = {
  fullName?: string;
  phone?: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  isDefault?: boolean;
};

export type ProductImage = {
  url: string;
  key?: string;
};

export type Product = {
  _id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  discountPrice?: number;
  images: ProductImage[];
  stock: number;
  featured: boolean;
  createdAt?: string;
};

export type User = {
  _id: string;
  name?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  role: UserRole;
  blocked?: boolean;
  addresses: Address[];
  createdAt: string;
};

export type OrderProduct = {
  product: string | Product;
  name: string;
  image?: string;
  variant?: string;
  size?: string;
  quantity: number;
  price: number;
};

export type Order = {
  _id: string;
  userId: string | User;
  products: OrderProduct[];
  amount: number;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  shippingAddress: Address;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
};
