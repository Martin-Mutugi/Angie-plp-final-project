import express from 'express';
import Donation from '../models/Donation.js';
import paystackService from '../services/paystackService.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// Initialize a donation
router.post('/init', async (req, res) => {
  try {
    const { type, recipientId, amount, currency, donorEmail, donorName, notes } = req.body;

    // Create donation record
    const donation = new Donation({
      type,
      recipientId: type === 'DIRECT' ? recipientId : null,
      amount,
      currency: currency || 'KES',
      status: 'INITIATED',
      paystackRef: `donation_${uuidv4()}`,
      metadata: {
        donorEmail,
        donorName,
        notes,
        userAgent: req.get('User-Agent'),
        ipAddress: req.ip
      }
    });

    await donation.save();

    // Initialize Paystack transaction
    const paystackResponse = await paystackService.initializeTransaction(donation);

    // Update donation with Paystack reference
    donation.paystackRef = paystackResponse.data.reference;
    donation.status = 'PENDING';
    await donation.save();

    res.json({
      message: 'Donation initialized',
      authorizationUrl: paystackResponse.data.authorization_url,
      donationId: donation._id,
      paystackRef: donation.paystackRef
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify donation after Paystack callback
router.get('/verify/:id', async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    // Redirect to frontend success page
    res.redirect(`https://angie-plp-final-project.vercel.app/donation/success?donationId=${donation._id}`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;