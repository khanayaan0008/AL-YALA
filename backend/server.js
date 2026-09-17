const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// 1. CORS Configuration (Frontend to Backend Connection)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Body Parser (Image and JSON support)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// 3. MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/woodcraft_marketplace';

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB Connected successfully!'))
  .catch((err) => console.error('❌ Database Connection Error:', err.message));

// 4. Test Health Route
app.get('/', (req, res) => {
  res.send('AuraWood Backend Server is running successfully!');
});

// 5. Register Routes (matching your exact files)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/ProductRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/checkout', require('./routes/checkoutRoutes'));

// 6. Listen Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});