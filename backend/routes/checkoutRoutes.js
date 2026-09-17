const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Payout = require('../models/Payout');
const User = require('../models/User');
const { verifyToken } = require('../middleware/auth');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

router.post('/create-order', verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/verify-payment', verifyToken, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      items, 
      shippingAddress 
    } = req.body;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }

    const totalAmount = items.reduce((acc, curr) => acc + (curr.price * (curr.quantity || 1)), 0);

    const order = new Order({
      buyer: req.user._id,
      items: items.map(item => ({
        product: item._id,
        seller: item.seller?._id || item.seller,
        quantity: item.quantity || 1,
        price: item.price
      })),
      shippingAddress,
      paymentMethod: 'Online',
      paymentStatus: 'Completed',
      transactionId: razorpay_payment_id,
      totalAmount
    });

    await order.save();

    for (const item of items) {
      const sellerId = item.seller?._id || item.seller;
      const itemTotal = item.price * (item.quantity || 1);
      const platformCut = itemTotal * 0.10;
      const sellerNetEarning = itemTotal - platformCut;

      await Payout.create({
        sellerId,
        orderId: order._id,
        totalItemPrice: itemTotal,
        platformCommissionRate: 0.10,
        platformCut,
        sellerNetEarning,
        status: 'Pending_Delivery'
      });

      await User.findByIdAndUpdate(sellerId, {
        $inc: {
          'wallet.pendingBalance': sellerNetEarning,
          'wallet.totalEarnings': sellerNetEarning
        }
      });
    }

    res.status(201).json({ success: true, orderId: order._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;