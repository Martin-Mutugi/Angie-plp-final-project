import express from 'express';
import Allocation from '../models/Allocation.js';
import Recipient from '../models/Recipient.js';

const router = express.Router();

// Create allocation (Admin only)
router.post('/', async (req, res) => {
  try {
    const { source, recipientId, amount, currency, donationIds, notes } = req.body;
    
    const allocation = new Allocation({
      source,
      recipientId,
      amount,
      currency: currency || 'KES',
      donationIds: donationIds || [],
      notes,
      performedBy: '65a1b2c3d4e5f67890123456' // Temporary admin ID
    });

    await allocation.save();

    // Update recipient's total received
    await Recipient.findByIdAndUpdate(
      recipientId,
      { $inc: { totalReceived: amount } }
    );

    res.status(201).json(allocation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all allocations
router.get('/', async (req, res) => {
  try {
    const allocations = await Allocation.find()
      .populate('recipientId', 'fullName')
      .populate('performedBy', 'name')
      .sort({ createdAt: -1 });
    
    res.json(allocations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;