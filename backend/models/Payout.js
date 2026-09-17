const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  totalItemPrice: { type: Number, required: true },
  platformCommissionRate: { type: Number, default: 0.10 },
  platformCut: { type: Number, required: true },
  sellerNetEarning: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending_Delivery', 'Available_For_Payout', 'Paid_Out'], 
    default: 'Pending_Delivery' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Payout', payoutSchema);