const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmPayment } = require('../controllers/paymentController');

router.route('/create').post(createPaymentIntent)
router.route('/confirm').post(confirmPayment)

module.exports = router;