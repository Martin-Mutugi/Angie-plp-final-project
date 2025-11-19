import express from 'express';
import Donation from '../models/Donation.js';
import Recipient from '../models/Recipient.js';

const router = express.Router();

// Paystack webhook for payment verification
router.post('/webhook', async (req, res) => {
  try {
    const event = req.body;
    console.log('Webhook received:', event.event);

    if (event.event === 'charge.success') {
      const transaction = event.data;
      
      // Find donation by reference
      const donation = await Donation.findOne({ paystackRef: transaction.reference });
      if (!donation) {
        return res.status(404).json({ error: 'Donation not found' });
      }

      // Update donation status
      donation.status = 'SUCCEEDED';
      donation.paystackTrxId = transaction.id;
      await donation.save();

      // If direct donation, credit the recipient
      if (donation.type === 'DIRECT' && donation.recipientId) {
        await Recipient.findByIdAndUpdate(
          donation.recipientId,
          { $inc: { totalReceived: donation.amount } }
        );
      }

      console.log(`Donation ${donation._id} completed successfully`);
      
      // Simulate sending receipt email
      console.log(`Email receipt sent to: ${donation.metadata.donorEmail}`);
      console.log(`Receipt: Thank you for your donation of ${donation.amount} KES`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;