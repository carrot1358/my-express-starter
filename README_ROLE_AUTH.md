# Role-Based Authentication Examples

This document demonstrates how to use the role-based authentication system with decorator pattern.

## Available Roles

```javascript
const Role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  USER: 'USER'
}
```

## Authentication Middleware

### Basic Usage

```javascript
const { authenticateToken, requireRole, requireAdmin, requireSuperAdmin, Role } = require('../middleware/auth');

// Single role
router.get('/admin-only', authenticateToken, requireRole(Role.ADMIN), handler);

// Multiple roles (user must have ANY of these roles)
router.post('/products', authenticateToken, requireRole(Role.ADMIN, Role.SUPER_ADMIN), handler);

// Convenience methods
router.get('/admin-stats', authenticateToken, requireAdmin(), handler); // ADMIN or SUPER_ADMIN
router.delete('/critical', authenticateToken, requireSuperAdmin(), handler); // SUPER_ADMIN only
```

### Combined Authentication and Authorization

```javascript
// Use authAndRole for cleaner syntax
const { authAndRole, Role } = require('../middleware/auth');

router.post('/products', ...authAndRole(Role.ADMIN, Role.SUPER_ADMIN), ProductController.createProduct);
```

## Product Routes Examples

### Public Routes (No Authentication)
```bash
GET /api/products                    # Anyone can view products
GET /api/products/search?q=laptop    # Anyone can search
GET /api/products/1                  # Anyone can view product details
```

### Admin Routes (ADMIN + SUPER_ADMIN)
```bash
POST /api/products                   # Create product (ADMIN + SUPER_ADMIN)
PUT /api/products/1                  # Update product (ADMIN + SUPER_ADMIN)
GET /api/products/admin/stats        # View statistics (ADMIN + SUPER_ADMIN)
```

### Super Admin Only Routes
```bash
DELETE /api/products/1               # Delete product (SUPER_ADMIN only)
```

## Test Users

The seed script creates these test accounts:

| Username    | Password      | Role        | Email                |
|-------------|---------------|-------------|----------------------|
| superadmin  | superadmin123 | SUPER_ADMIN | superadmin@example.com |
| admin       | admin123      | ADMIN       | admin@example.com     |
| user        | user123       | USER        | user@example.com      |

## API Usage Examples

### 1. Login and Get Token

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "admin",
    "password": "admin123"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid-here",
      "username": "admin",
      "role": "ADMIN",
      ...
    },
    "token": "jwt-token-here",
    "expiresIn": "24h"
  }
}
```

### 2. Create Product (Admin Only)

```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "New Product",
    "description": "Product description",
    "price": 99.99
  }'
```

### 3. Access Denied Example

If a USER tries to create a product:
```json
{
  "error": "Insufficient permissions",
  "required": ["ADMIN", "SUPER_ADMIN"],
  "current": "USER"
}
```

## Database Setup

1. Start MySQL container:
```bash
docker-compose up -d
```

2. Run migrations:
```bash
npm run prisma:migrate
```

3. Seed database:
```bash
npm run prisma:seed
```

4. Reset database (if needed):
```bash
npm run db:reset
```

## Role Hierarchy

- **SUPER_ADMIN**: Can do everything (highest privilege)
- **ADMIN**: Can manage products, view stats, but cannot delete products
- **USER**: Can only view public content (lowest privilege)

## Adding New Role-Protected Endpoints

```javascript
// In your route file
const { authenticateToken, requireRole, Role } = require('../middleware/auth');

// Example: Only ADMIN and SUPER_ADMIN can access
router.post('/admin-action', 
  authenticateToken,                    // First check authentication
  requireRole(Role.ADMIN, Role.SUPER_ADMIN),  // Then check authorization
  YourController.adminAction
);

// Example: All authenticated users
router.get('/user-dashboard', 
  authenticateToken,
  requireRole(Role.USER, Role.ADMIN, Role.SUPER_ADMIN),
  YourController.dashboard
);
```

## JWT Token Structure

The JWT token includes:
```javascript
{
  "id": "user-uuid",
  "username": "admin",
  "email": "admin@example.com", 
  "role": "ADMIN",
  "firstName": "Admin",
  "lastName": "User",
  "iat": 1234567890,
  "exp": 1234567890
}
```

Role checking is performed against the `role` field in the token payload.