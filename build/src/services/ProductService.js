"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const client_1 = require("@prisma/client");
class ProductService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    async getAllProducts() {
        const products = await this.prisma.product.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return products;
    }
    async getProductById(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }
    async createProduct(data, userId) {
        const { name, description, price } = data;
        if (typeof price !== 'number' || price < 0) {
            throw new Error('Price must be a positive number');
        }
        const product = await this.prisma.product.create({
            data: {
                name,
                description: description || null,
                price,
                userId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        return {
            message: 'Product created successfully',
            product
        };
    }
    async updateProduct(id, data) {
        const { name, description, price } = data;
        // Check if product exists
        const existingProduct = await this.prisma.product.findUnique({
            where: { id }
        });
        if (!existingProduct) {
            throw new Error('Product not found');
        }
        // Validate price if provided
        if (price !== undefined && (typeof price !== 'number' || price < 0)) {
            throw new Error('Price must be a positive number');
        }
        // Build update data
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (description !== undefined)
            updateData.description = description;
        if (price !== undefined)
            updateData.price = price;
        const product = await this.prisma.product.update({
            where: { id },
            data: updateData,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
        return {
            message: 'Product updated successfully',
            product
        };
    }
    async deleteProduct(id) {
        // Check if product exists
        const existingProduct = await this.prisma.product.findUnique({
            where: { id }
        });
        if (!existingProduct) {
            throw new Error('Product not found');
        }
        await this.prisma.product.delete({
            where: { id }
        });
        return {
            message: 'Product deleted successfully'
        };
    }
}
exports.ProductService = ProductService;
//# sourceMappingURL=ProductService.js.map