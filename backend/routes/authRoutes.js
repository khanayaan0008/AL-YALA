const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Auto-define User Model safely to prevent missing model crashes
let User;
try {
  User = mongoose.model('User');
} catch {
  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'buyer' }, // buyer | seller | admin
    brandName: { type: String, default: '' }
  }, { timestamps: true });
  User = mongoose.model('User', userSchema);
}

const JWT_SECRET = process.env.JWT_SECRET || 'aurawood_secret_key_2026';

// 1. Register Route (POST /api/auth/register)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, brandName } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const user = new User({
      name,
      email: email.toLowerCase().trim(),
      password,
      role: role || 'buyer',
      brandName: brandName || ''
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        brandName: user.brandName
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Login Route (POST /api/auth/login)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: 'User not found. Please register first.' });
    }

    if (user.password !== password) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        brandName: user.brandName
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;