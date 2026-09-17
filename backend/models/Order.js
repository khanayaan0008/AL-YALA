const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true }
  }],
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentMethod: { type: String, enum: ['COD', 'Online'], default: 'Online' },
  paymentStatus: { type: String, enum: ['Pending', 'Completed', 'Failed'], default: 'Pending' },
  transactionId: { type: String, default: '' },
  orderStatus: { 
    type: String, 
    enum: ['Order Placed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Order Placed' 
  },
  courierDetails: {
    courierName: { type: String, default: '' },
    trackingNumber: { type: String, default: '' },
    updatedAt: Date
  },
  totalAmount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);