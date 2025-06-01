require('dotenv').config();
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const auth = require("../Middleware/JWT/authenticateJWT");
const { getStudentById, updateStripeId } = require('../Model/userModel');


router.post('/payment-sheet', auth,  async (req, res) => {
    try{
        const studentId = req.user.userId;
        const { amount } = req.body;
        const amt = amount;
        console.log("Received Amount:", amt);
        

        const student = await new Promise((resolve, reject) => {
            getStudentById(studentId, (err, student) => {
            if (err) {
                reject(err);
            } else {
                resolve(student);
            }
            });
        });

        console.log("Extracted User ID from Token:", student);

        let customerId = student.stripe_id;
        let customer;

        if(!customerId) {
            customer = await stripe.customers.create({

                name: student.first_name + " " + student.last_name,
                email: student.email
            });

            student.stripe_id = customer.id;
            await new Promise((resolve, reject) => {
                updateStripeId(studentId, customer.id, (err, result) => {
                  if (err) reject(err);
                  else resolve(result);  
                });
              });
        }else {
            customer = {id: customerId};
        }
        
    
        const ephemeralKey = await stripe.ephemeralKeys.create(
            {customer: customer.id},
            {apiVersion: '2025-03-31.basil'}
        );
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amt, 
            currency: 'fjd',
            customer: customer.id,
            description: 'Invoice payment',
            automatic_payment_methods: {
            enabled: true,
            },
        });
    
        res.json({
            paymentIntent: paymentIntent.client_secret,
            ephemeralKey: ephemeralKey.secret,
            customer: customer.id,
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
        });

    } catch (error) {
        console.error("Error creating payment sheet:", error);
        res.status(500).json({ error: 'Payment setup failed' });
    }

});

router.post('/create-payment-intent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // $10.00 (in cents)
      currency: 'usd',
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;