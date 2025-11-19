const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/auth', require('./routes/auth'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Grocery Store API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      health: '/health',
      products: '/api/products',
      cart: '/api/cart/:userId',
      orders: '/api/orders/:userId',
      auth: '/api/auth'
    },
    documentation: 'See README.md for API documentation'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/grocery-store';
const PORT = process.env.PORT || 5000;

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('MongoDB Connected Successfully');
  app.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
  });
})
.catch((error) => {
  console.error('MongoDB Connection Error:', error);
  process.exit(1);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

module.exports = app;

