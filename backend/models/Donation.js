import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['DIRECT', 'POOL'],
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipient'
  },
  amount: {
    type: Number,
    required: true,
    min: 100
  },
  currency: {
    type: String,
   enum: ['KES', 'NGN', 'GHS', 'ZAR', 'USD'],
    default: 'KES'
  },
  status: {
    type: String,
    enum: ['INITIATED', 'PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED'],
    default: 'INITIATED'
  },
  paystackRef: String,
  paystackTrxId: String,
  metadata: {
    donorEmail: String,
    donorName: String,
    notes: String,
    userAgent: String,
    ipAddress: String
  }
}, {
  timestamps: true
});

export default mongoose.model('Donation', donationSchema);