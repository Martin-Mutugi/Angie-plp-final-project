import mongoose from 'mongoose';

const needSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ['EDUCATION', 'HEALTHCARE', 'FOOD', 'HOUSING', 'CLOTHING', 'OTHER']
  },
  description: {
    type: String,
    required: true,
    maxlength: 500
  },
  amountNeeded: {
    type: Number,
    required: true,
    min: 0
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM'
  }
});

const recipientSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  bio: {
    type: String,
    required: true,
    maxlength: 1000
  },
  needs: [needSchema],
  photos: [{
    url: String,
    caption: String
  }],
  location: {
    address: String,
    city: String,
    state: String,
    country: {
      type: String,
      default: 'Nigeria'
    }
  },
  verificationStatus: {
    type: String,
    enum: ['PENDING', 'VERIFIED', 'REJECTED'],
    default: 'PENDING'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalReceived: {
    type: Number,
    default: 0,
    min: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Recipient', recipientSchema);