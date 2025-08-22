const express = require('express');
const router = express.Router();
const UserController = require('@/controllers/UserController');
const { authenticateToken, requireRole, requireAdmin, requireSuperAdmin, Role } = require('@/middleware/auth');
const { rateLimit } = require('@/middleware/rate-limit');

// Get all users
router.get('/', UserController.getAllUsers);

// Get user by ID
router.get('/:id', UserController.getUserById);

// Create new user
router.post('/', UserController.createUser);

// Update user
router.put('/:id', UserController.updateUser);

// Delete user
router.delete('/:id', UserController.deleteUser);

module.exports = router;
