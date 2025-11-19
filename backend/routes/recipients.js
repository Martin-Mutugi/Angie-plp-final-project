import express from 'express';
import Recipient from '../models/Recipient.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all recipients (public)
router.get('/', async (req, res) => {
  try {
    const recipients = await Recipient.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(recipients);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single recipient (public)
router.get('/:id', async (req, res) => {
  try {
    const recipient = await Recipient.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found' });
    }
    
    res.json(recipient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new recipient (Admin only)
router.post('/', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { fullName, bio, needs, location } = req.body;
    
    const recipient = new Recipient({
      fullName,
      bio,
      needs,
      location,
      createdBy: req.user._id // Use actual admin user ID from auth
    });

    await recipient.save();
    res.status(201).json(recipient);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;