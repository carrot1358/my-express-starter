"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const tsoa_1 = require("tsoa");
const ProductService_1 = require("../services/ProductService");
const TokenService_1 = require("../services/TokenService");
const express_1 = __importDefault(require("express"));
let ProductController = class ProductController extends tsoa_1.Controller {
    constructor() {
        super();
        this.productService = new ProductService_1.ProductService();
        this.tokenService = new TokenService_1.TokenService();
    }
    async getAllProducts() {
        try {
            return await this.productService.getAllProducts();
        }
        catch (error) {
            this.setStatus(500);
            throw new Error(error instanceof Error ? error.message : 'Failed to get products');
        }
    }
    async getProductById(id) {
        try {
            return await this.productService.getProductById(id);
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Product not found') {
                this.setStatus(404);
            }
            else {
                this.setStatus(500);
            }
            throw new Error(error instanceof Error ? error.message : 'Failed to get product');
        }
    }
    async createProduct(requestBody, request) {
        try {
            // Get user from request (set by middleware)
            const user = request.user;
            if (!user) {
                this.setStatus(401);
                throw new Error('Authentication required');
            }
            // Check if user is admin
            if (user.role.name !== 'ADMIN') {
                this.setStatus(403);
                throw new Error('Admin role required');
            }
            return await this.productService.createProduct(requestBody, user.id);
        }
        catch (error) {
            if (!this.getStatus()) {
                this.setStatus(400);
            }
            throw new Error(error instanceof Error ? error.message : 'Failed to create product');
        }
    }
    async updateProduct(id, requestBody, request) {
        try {
            // Get user from request (set by middleware)
            const user = request.user;
            if (!user) {
                this.setStatus(401);
                throw new Error('Authentication required');
            }
            // Check if user is admin
            if (user.role.name !== 'ADMIN') {
                this.setStatus(403);
                throw new Error('Admin role required');
            }
            return await this.productService.updateProduct(id, requestBody);
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Product not found') {
                this.setStatus(404);
            }
            else if (!this.getStatus()) {
                this.setStatus(400);
            }
            throw new Error(error instanceof Error ? error.message : 'Failed to update product');
        }
    }
    async deleteProduct(id, request) {
        try {
            // Get user from request (set by middleware)
            const user = request.user;
            if (!user) {
                this.setStatus(401);
                throw new Error('Authentication required');
            }
            // Check if user is admin
            if (user.role.name !== 'ADMIN') {
                this.setStatus(403);
                throw new Error('Admin role required');
            }
            return await this.productService.deleteProduct(id);
        }
        catch (error) {
            if (error instanceof Error && error.message === 'Product not found') {
                this.setStatus(404);
            }
            else if (!this.getStatus()) {
                this.setStatus(500);
            }
            throw new Error(error instanceof Error ? error.message : 'Failed to delete product');
        }
    }
};
exports.ProductController = ProductController;
__decorate([
    (0, tsoa_1.Get)(),
    (0, tsoa_1.OperationId)('getAllProducts'),
    (0, tsoa_1.Example)([
        {
            id: 'product-id',
            name: 'Sample Product',
            description: 'A sample product',
            price: 99.99,
            userId: 'user-id',
            createdAt: new Date(),
            updatedAt: new Date(),
            user: {
                id: 'user-id',
                name: 'John Doe',
                email: 'john@example.com'
            }
        }
    ]),
    (0, tsoa_1.Response)(500, 'Internal Server Error'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllProducts", null);
__decorate([
    (0, tsoa_1.Get)('{id}'),
    (0, tsoa_1.OperationId)('getProductById'),
    (0, tsoa_1.Example)({
        id: 'product-id',
        name: 'Sample Product',
        description: 'A sample product',
        price: 99.99,
        userId: 'user-id',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: {
            id: 'user-id',
            name: 'John Doe',
            email: 'john@example.com'
        }
    }),
    (0, tsoa_1.Response)(404, 'Product not found'),
    (0, tsoa_1.Response)(500, 'Internal Server Error'),
    __param(0, (0, tsoa_1.Path)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductById", null);
__decorate([
    (0, tsoa_1.Post)(),
    (0, tsoa_1.OperationId)('createProduct'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Example)({
        message: 'Product created successfully',
        product: {
            id: 'product-id',
            name: 'New Product',
            description: 'A new product',
            price: 29.99,
            userId: 'user-id',
            createdAt: new Date(),
            updatedAt: new Date(),
            user: {
                id: 'user-id',
                name: 'Admin User',
                email: 'admin@example.com'
            }
        }
    }),
    (0, tsoa_1.Response)(400, 'Bad Request'),
    (0, tsoa_1.Response)(401, 'Unauthorized'),
    (0, tsoa_1.Response)(403, 'Forbidden - Admin role required'),
    (0, tsoa_1.Response)(500, 'Internal Server Error'),
    __param(0, (0, tsoa_1.Body)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "createProduct", null);
__decorate([
    (0, tsoa_1.Put)('{id}'),
    (0, tsoa_1.OperationId)('updateProduct'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Example)({
        message: 'Product updated successfully',
        product: {
            id: 'product-id',
            name: 'Updated Product',
            description: 'An updated product',
            price: 39.99,
            userId: 'user-id',
            createdAt: new Date(),
            updatedAt: new Date(),
            user: {
                id: 'user-id',
                name: 'Admin User',
                email: 'admin@example.com'
            }
        }
    }),
    (0, tsoa_1.Response)(400, 'Bad Request'),
    (0, tsoa_1.Response)(401, 'Unauthorized'),
    (0, tsoa_1.Response)(403, 'Forbidden - Admin role required'),
    (0, tsoa_1.Response)(404, 'Product not found'),
    (0, tsoa_1.Response)(500, 'Internal Server Error'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Body)()),
    __param(2, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "updateProduct", null);
__decorate([
    (0, tsoa_1.Delete)('{id}'),
    (0, tsoa_1.OperationId)('deleteProduct'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Example)({
        message: 'Product deleted successfully'
    }),
    (0, tsoa_1.Response)(401, 'Unauthorized'),
    (0, tsoa_1.Response)(403, 'Forbidden - Admin role required'),
    (0, tsoa_1.Response)(404, 'Product not found'),
    (0, tsoa_1.Response)(500, 'Internal Server Error'),
    __param(0, (0, tsoa_1.Path)()),
    __param(1, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteProduct", null);
exports.ProductController = ProductController = __decorate([
    (0, tsoa_1.Route)('products'),
    (0, tsoa_1.Tags)('Products'),
    __metadata("design:paramtypes", [])
], ProductController);
//# sourceMappingURL=ProductController.js.map