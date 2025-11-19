import axios from 'axios';

class PaystackService {
  constructor() {
    this.baseURL = 'https://api.paystack.co';
  }

  getSecretKey() {
    return process.env.PAYSTACK_SECRET_KEY;
  }

  getHttpClient() {
    const secretKey = this.getSecretKey();
    
    if (!secretKey) {
      throw new Error('PAYSTACK_SECRET_KEY is not configured');
    }

    return axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${secretKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async initializeTransaction(donationData) {
    try {
      const secretKey = this.getSecretKey();
      
      console.log('Initializing Paystack transaction with:', {
        amount: donationData.amount,
        currency: donationData.currency,
        email: donationData.metadata.donorEmail,
        secretKey: secretKey ? 'Loaded' : 'Missing'
      });

      console.log('Sending to Paystack - Currency:', donationData.currency, 'Amount:', donationData.amount * 100);

      if (!secretKey) {
        throw new Error('PAYSTACK_SECRET_KEY is not configured');
      }

      const httpClient = this.getHttpClient();

      const response = await httpClient.post('/transaction/initialize', {
        email: donationData.metadata.donorEmail,
        amount: donationData.amount * 100,
        currency: donationData.currency,
        reference: donationData.paystackRef,
        callback_url: `${process.env.APP_URL}/api/donations/verify/${donationData._id}`,
        metadata: {
          donation_id: donationData._id.toString(),
          type: donationData.type
        }
      });

      console.log('Paystack response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Paystack initialization error:', error.response?.data || error.message);
      throw new Error('Failed to initialize Paystack transaction: ' + (error.response?.data?.message || error.message));
    }
  }
}

export default new PaystackService();