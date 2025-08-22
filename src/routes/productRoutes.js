const express = require('express');
const ProductController = require('@/controllers/ProductController');
const { authenticateToken, requireRole, requireAdmin, requireSuperAdmin, Role } = require('@/middleware/auth');
const { rateLimit } = require('@/middleware/rate-limit');

const router = express.Router();

// Public routes (no authentication required)
router.get('/', ProductController.getAllProducts);
router.get('/paginated', ProductController.getProductsPaginated);
router.get('/search', ProductController.searchProducts);
router.get('/:id', ProductController.getProductById);

// Admin and Super Admin only routes
router.post('/', 
  rateLimit(20, 60), // 20 requests per minute for creating products
  authenticateToken, 
  requireRole(Role.ADMIN, Role.SUPER_ADMIN), 
  ProductController.createProduct
);

router.put('/:id', 
  rateLimit(30, 60), // 30 requests per minute for updating products
  authenticateToken, 
  requireRole(Role.ADMIN, Role.SUPER_ADMIN), 
  ProductController.updateProduct
);

// Super Admin only routes
router.delete('/:id', 
  rateLimit(5, 60), // Very strict: 5 deletes per minute
  authenticateToken, 
  requireSuperAdmin(), 
  ProductController.deleteProduct
);

// Admin statistics (Admin and Super Admin)
router.get('/admin/stats', 
  rateLimit(100, 60), // 100 requests per minute for stats
  authenticateToken, 
  requireAdmin(), 
  ProductController.getProductStats
);

module.exports = router;