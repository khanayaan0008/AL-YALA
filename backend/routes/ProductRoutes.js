const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Auto-define Product Schema safely
let Product;
try {
  Product = mongoose.model('Product');
} catch {
  const productSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    woodType: { type: String, default: 'Sheesham' },
    stock: { type: Number, default: 1 },
    images: [{ type: String }],
    isApproved: { type: Boolean, default: false },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  }, { timestamps: true });
  Product = mongoose.model('Product', productSchema);
}

// 1. Create / Upload Product (POST /api/products)
router.post('/', async (req, res) => {
  try {
    const { title, description, price, woodType, stock, images } = req.body;

    if (!title || !price || !description) {
      return res.status(400).json({ message: 'Title, price, and description are required.' });
    }

    const newProduct = new Product({
      title,
      description,
      price: Number(price),
      woodType: woodType || 'Sheesham',
      stock: Number(stock) || 1,
      images: images && images.length > 0 ? images : ['https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80'],
      isApproved: false // Admin approval ke liye pending
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({ success: true, product: savedProduct });
  } catch (err) {
    console.error('Error saving product:', err);
    res.status(500).json({ message: err.message });
  }
});

// 2. Get Approved Products for Home Page (GET /api/products)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({ isApproved: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Get All Products for Admin Console (GET /api/products/all)
router.get('/all', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Approve Product (PATCH /api/products/:id/approve)
router.patch('/:id/approve', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;