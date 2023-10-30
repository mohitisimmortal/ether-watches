const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/authenticateToken');
const authorizeRole = require('../middlewares/authorizeRole');
const { getOrders, createOrder, getOrdersToUser } = require('../controllers/orderController');

router.route('/getorders').get(authenticateToken, authorizeRole('admin'), getOrders);
router.route('/getorderstouser/:id').get(authenticateToken, getOrdersToUser);
router.route('/createorder').post(authenticateToken, createOrder);

module.exports = router;