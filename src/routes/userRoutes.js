const express = require('express');
const router = express.Router();
const UserController = require('@/controllers/UserController');
const { authenticateToken, requireRole, requireAdmin, requireSuperAdmin, Role } = require('@/middleware/auth');
const { rateLimit } = require('@/middleware/rate-limit');

// Get all users
router.get('/', 
  rateLimit(10, 60), // 10 requests per minute
  authenticateToken, 
  requireRole(Role.ADMIN, Role.SUPER_ADMIN), 
  UserController.getAllUsers
);

// Get user by ID
router.get('/:id', 
  rateLimit(10, 60), // 10 requests per minute
  authenticateToken, 
  requireRole(Role.ADMIN, Role.SUPER_ADMIN), 
  UserController.getUserById
);

// Create new user
router.post('/', 
  rateLimit(20, 60), // 20 requests per minute
  authenticateToken, 
  requireRole(Role.ADMIN, Role.SUPER_ADMIN), 
  UserController.createUser
);

// Update user
router.put('/:id', 
  rateLimit(30, 60), // 30 requests per minute
  authenticateToken, 
  requireRole(Role.ADMIN, Role.SUPER_ADMIN), 
  UserController.updateUser
);

// Delete user
router.delete('/:id', 
  rateLimit(5, 60), // Very strict: 5 deletes per minute
  authenticateToken, 
  requireRole(Role.SUPER_ADMIN), 
  UserController.deleteUser
);

module.exports = router;
