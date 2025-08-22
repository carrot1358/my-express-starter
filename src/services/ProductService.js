const { PrismaClient } = require('@prisma/client');

// Single Prisma client instance
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
});

// Handle graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

class ProductService {
  // Get all products with optional search, pagination, and filtering
  static async getAllProducts(options = {}) {
    try {
      const { 
        search,
        page,
        limit,
        orderBy = 'createdAt',
        order = 'desc'
      } = options;

      // Build where clause for search
      let whereClause = {};
      if (search && search.trim() !== '') {
        whereClause = {
          OR: [
            {
              name: {
                contains: search.trim()
              }
            },
            {
              description: {
                contains: search.trim()
              }
            }
          ]
        };
      }

      // Build order by clause
      const orderByClause = {};
      orderByClause[orderBy] = order;

      // Handle pagination
      if (page && limit) {
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        
        if (isNaN(pageNum) || pageNum < 1) {
          const error = new Error('Page must be a positive number');
          error.name = 'ValidationError';
          throw error;
        }

        if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
          const error = new Error('Limit must be between 1 and 100');
          error.name = 'ValidationError';
          throw error;
        }

        const skip = (pageNum - 1) * limitNum;

        const [products, total] = await Promise.all([
          prisma.product.findMany({
            where: whereClause,
            skip,
            take: limitNum,
            orderBy: orderByClause,
          }),
          prisma.product.count({ where: whereClause })
        ]);

        return {
          products,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            pages: Math.ceil(total / limitNum),
            hasNext: pageNum < Math.ceil(total / limitNum),
            hasPrev: pageNum > 1,
          }
        };
      }

      // Return all products without pagination
      const products = await prisma.product.findMany({
        where: whereClause,
        orderBy: orderByClause,
      });

      return products;
    } catch (error) {
      console.error('Get all products error:', error);
      throw error;
    }
  }

  // Get product by ID
  static async getProductById(id) {
    try {
      if (!id || typeof id !== 'string' || id.trim() === '') {
        const error = new Error('Invalid product ID');
        error.name = 'ValidationError';
        throw error;
      }

      const product = await prisma.product.findUnique({
        where: { id: id.trim() },
      });
      return product;
    } catch (error) {
      console.error('Get product by ID error:', error);
      throw error;
    }
  }

  // Create new product (Admin only)
  static async createProduct(productData) {
    try {
      const { name, description, price } = productData;

      // Validate required fields
      if (!name || price === undefined || price === null) {
        const error = new Error('Name and price are required');
        error.name = 'ValidationError';
        throw error;
      }

      // Validate price
      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice) || numericPrice < 0) {
        const error = new Error('Price must be a valid positive number');
        error.name = 'ValidationError';
        throw error;
      }

      const newProduct = await prisma.product.create({
        data: {
          name: name.trim(),
          description: description ? description.trim() : null,
          price: numericPrice,
        },
      });

      return newProduct;
    } catch (error) {
      console.error('Create product error:', error);
      throw error;
    }
  }

  // Update product (Admin only)
  static async updateProduct(id, updateData) {
    try {
      if (!id || typeof id !== 'string' || id.trim() === '') {
        const error = new Error('Invalid product ID');
        error.name = 'ValidationError';
        throw error;
      }

      const productId = id.trim();

      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!existingProduct) {
        return null;
      }

      // Validate update data
      const { name, description, price } = updateData;
      
      if (price !== undefined && price !== null) {
        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice) || numericPrice < 0) {
          const error = new Error('Price must be a valid positive number');
          error.name = 'ValidationError';
          throw error;
        }
      }

      const updatedProduct = await prisma.product.update({
        where: { id: productId },
        data: {
          ...(name && { name: name.trim() }),
          ...(description !== undefined && { description: description ? description.trim() : null }),
          ...(price !== undefined && price !== null && { price: parseFloat(price) }),
        },
      });

      return updatedProduct;
    } catch (error) {
      console.error('Update product error:', error);
      throw error;
    }
  }

  // Delete product (Admin only)
  static async deleteProduct(id) {
    try {
      if (!id || typeof id !== 'string' || id.trim() === '') {
        const error = new Error('Invalid product ID');
        error.name = 'ValidationError';
        throw error;
      }

      const productId = id.trim();
      
      // Check if product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id: productId }
      });

      if (!existingProduct) {
        return false;
      }

      await prisma.product.delete({
        where: { id: productId }
      });

      return true;
    } catch (error) {
      console.error('Delete product error:', error);
      throw error;
    }
  }


  // Get product statistics
  static async getProductStats() {
    try {
      const [totalProducts, avgPrice, maxPrice, minPrice] = await Promise.all([
        prisma.product.count(),
        prisma.product.aggregate({
          _avg: {
            price: true,
          },
        }),
        prisma.product.aggregate({
          _max: {
            price: true,
          },
        }),
        prisma.product.aggregate({
          _min: {
            price: true,
          },
        }),
      ]);

      return {
        totalProducts,
        averagePrice: avgPrice._avg.price || 0,
        maxPrice: maxPrice._max.price || 0,
        minPrice: minPrice._min.price || 0,
      };
    } catch (error) {
      console.error('Get product statistics error:', error);
      throw error;
    }
  }
}

module.exports = ProductService;