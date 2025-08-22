const express = require('express');
const AuthController = require('@/controllers/AuthController');
const { authenticateToken } = require('@/middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/refresh-token', AuthController.refreshToken);
router.post('/line-login', AuthController.loginWithLine);

// Protected routes
router.get('/profile', authenticateToken, AuthController.getProfile);

module.exports = router;