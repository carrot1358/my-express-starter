const express = require('express');
const router = express.Router();
const LineController = require('../controllers/LineController');

// LINE OAuth callback
router.get('/callback', LineController.handleCallback);

// LINE webhook for receiving messages
router.post('/webhook', LineController.handleWebhook);

// Get LINE login URL
router.get('/login', LineController.getLoginUrl);

// Get user profile from LINE
router.get('/profile', LineController.getUserProfile);

module.exports = router;
