const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  woodType: { 
    type: String, 
    enum: ['Teak', 'Sheesham', 'Bamboo', 'Reclaimed Pine', 'Oak'], 
    required: true 
  },
  images: [{ type: String, required: true }],
  stock: { type: Number, default: 1 },
  isApprovedByAdmin: { type: Boolean, default: false }
}, { timestamps: true });
// Purani line hata kar ye paste karein:
module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);