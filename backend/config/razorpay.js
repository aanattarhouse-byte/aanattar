import Razorpay from 'razorpay';

let razorpay;

function getRazorpay() {
  if (razorpay) return razorpay;

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are required. Set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in backend/.env');
  }

  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  });

  return razorpay;
}

export default {
  get orders() {
    return getRazorpay().orders;
  }
};
