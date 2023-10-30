const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create a PaymentIntent
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount, currency, items } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata: { integration_check: 'accept_a_payment' },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating PaymentIntent:', error);
    res.status(500).send('Error creating PaymentIntent');
  }
};

// Handle payment confirmation
exports.confirmPayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
    res.json({ paymentIntent });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).send('Error confirming payment');
  }
};
