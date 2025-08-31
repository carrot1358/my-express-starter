const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { defaultRateLimit, authRateLimit } = require('@/middleware/rate-limit');
const errorHandler = require('@/middleware/errorHandler');
const lineRoutes = require('@/routes/lineRoutes');
const userRoutes = require('@/routes/userRoutes');
const authRoutes = require('@/routes/authRoutes');
const productRoutes = require('@/routes/productRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
app.use(defaultRateLimit);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api/line', lineRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRateLimit, authRoutes);
app.use('/api/products', productRoutes);

// 404 handler for unmatched routes - using a different approach
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler - must be last
app.use(errorHandler);

module.exports = app;
