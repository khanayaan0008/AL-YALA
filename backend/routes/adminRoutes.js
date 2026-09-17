const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const Payout = require('../models/Payout');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

router.use(verifyToken, authorizeRoles('admin'));

router.get('/pending-products', async (req, res) => {
  try {
    const products = await Product.find({ isApprovedByAdmin: false }).populate('seller', 'name email shopDetails');
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.patch('/product/:id/approve', async (req, res) => {
  try {
    const { isApproved } = req.body;
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      { isApprovedByAdmin: isApproved }, 
      { new: true }
    );
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/platform-analytics', async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const activeListings = await Product.countDocuments({ isApprovedByAdmin: true });
    const payouts = await Payout.find();
    
    const totalCommissionEarned = payouts.reduce((acc, curr) => acc + curr.platformCut, 0);
    const totalGrossRevenue = payouts.reduce((acc, curr) => acc + curr.totalItemPrice, 0);

    res.json({
      success: true,
      analytics: {
        totalOrders,
        activeListings,
        totalCommissionEarned,
        totalGrossRevenue
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;