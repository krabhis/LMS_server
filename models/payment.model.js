import { model, Schema } from 'mongoose';

const paymentSchema = new Schema(
  {
    razorpayPaymentId: {
      type: String,
      required: true,
    },
    razorpaySubscriptionId: {
      type: String,
      required: true,
    },
    razorpaySignature: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Payment = model('Payment', paymentSchema);

export default Payment;



