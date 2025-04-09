
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Ensure you have the Stripe secret key in your environment variables
const router = express.Router();
const { updatePaymentsHandler } = require("../Controller/financeController");


router.post('/payment-info', express.json({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; 

    let event = req.body;


    const eventTimestamp = event.created;
    const eventDate = new Date(eventTimestamp * 1000); 
    const created_at = eventDate.toISOString().slice(0, 19).replace('T', ' ');

    // Handle the event
    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object; 
            const transaction_id = paymentIntent.id; 
            const amount_paid = paymentIntent.amount; 
            const currency = paymentIntent.currency;
            const customerId = paymentIntent.customer;
            const paymentMethodId = paymentIntent.payment_method;
            const status = paymentIntent.status; 
            const customer_id = paymentIntent.customer; 

            
            try {
                const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
                const payment_method = paymentMethod.card ? paymentMethod.card.brand : 'Unknown Payment Method'; 

                
                console.log(`Payment Intent ID: ${paymentIntent.id}`);
                console.log(`Amount: ${amount_paid}`); 
                console.log(`Currency: ${currency}`);
                console.log(`Customer ID: ${customerId}`);
                console.log(`Payment Method ID: ${paymentMethodId}`);
                console.log(`Payment Method: ${payment_method}`);
                console.log(`Event Date: ${created_at}`);

                req.body = { customer_id, transaction_id, amount_paid, status, currency, payment_method, created_at };
                await updatePaymentsHandler(req, res);

                console.log('PaymentIntent was successful!');
                
            } catch (error) {
                console.error('Error fetching payment method:', error);
                if (!res.headersSent) {
                    res.status(500).json({ error: 'Error processing payment' });
                }
                return;
            }
            
            break;
        case 'payment_intent.payment_failed':
            const paymentFailedIntent = event.data.object;
            console.log('PaymentIntent failed');
            
            break;
        default:
            console.log(`Unhandled event type: ${event.type}`);
    }

    
    if (!res.headersSent) {
        res.json({ received: true });
    }
});

module.exports = router;