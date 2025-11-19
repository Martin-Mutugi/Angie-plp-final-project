import mongoose from 'mongoose';

const allocationSchema = new mongoose.Schema({
  source: {
    type: String,
    enum: ['POOL', 'ADJUSTMENT'],
    required: true
  },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipient',
    required: true
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
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  donationIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  }],
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

export default mongoose.model('Allocation', allocationSchema);