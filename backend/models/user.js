const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['buyer', 'seller', 'admin'], 
    default: 'buyer' 
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    pincode: { type: String, default: '' },
    phone: { type: String, default: '' }
  },
  shopDetails: {
    shopName: { type: String, default: '' },
    bio: { type: String, default: '' },
    ecoCertified: { type: Boolean, default: false }
  },
  wallet: {
    availableBalance: { type: Number, default: 0 },
    pendingBalance: { type: Number, default: 0 },
    totalEarnings: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Replace with this:
module.exports = mongoose.models.User || mongoose.model('User', userSchema);