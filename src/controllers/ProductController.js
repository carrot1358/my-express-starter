const ProductService = require('@/services/ProductService');
const { Role } = require('@/middleware/auth');

class ProductController {
  // Get all products (Public - anyone can view)
  static async getAllProducts(req, res, next) {
    try {
      const products = await ProductService.getAllProducts();
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      next(error);
    }
  }

  // Get products with pagination (Public)
  static async getProductsPaginated(req, res, next) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await ProductService.getAllProducts({ page, limit });
      res.json({
        success: true,
        data: result.products,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  // Get product by ID (Public)
  static async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await ProductService.getProductById(id);
      
      if (!product) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  // Search products (Public)
  static async searchProducts(req, res, next) {
    try {
      const { q: searchTerm } = req.query;
      const products = await ProductService.getAllProducts({ search: searchTerm });
      res.json({
        success: true,
        data: products,
        searchTerm: searchTerm || ''
      });
    } catch (error) {
      next(error);
    }
  }

  // Create product (Admin and Super Admin only)
  static async createProduct(req, res, next) {
    try {
      const productData = req.body;
      const newProduct = await ProductService.createProduct(productData);
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: newProduct
      });
    } catch (error) {
      next(error);
    }
  }

  // Update product (Admin and Super Admin only)
  static async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      const updatedProduct = await ProductService.updateProduct(id, updateData);
      
      if (!updatedProduct) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: updatedProduct
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete product (Super Admin only)
  static async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;
      const deleted = await ProductService.deleteProduct(id);
      
      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Product not found'
        });
      }

      res.json({
        success: true,
        message: 'Product deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }

  // Get product statistics (Admin and Super Admin only)
  static async getProductStats(req, res, next) {
    try {
      const stats = await ProductService.getProductStats();
      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;