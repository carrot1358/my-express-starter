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
exports.AuthController = void 0;
const tsoa_1 = require("tsoa");
const AuthService_1 = require("../services/AuthService");
const TokenService_1 = require("../services/TokenService");
const express_1 = __importDefault(require("express"));
let AuthController = class AuthController extends tsoa_1.Controller {
    constructor() {
        super();
        this.authService = new AuthService_1.AuthService();
        this.tokenService = new TokenService_1.TokenService();
    }
    async register(requestBody) {
        try {
            const result = await this.authService.register(requestBody);
            this.setStatus(201);
            return result;
        }
        catch (error) {
            this.setStatus(400);
            throw new Error(error instanceof Error ? error.message : 'Registration failed');
        }
    }
    async login(requestBody) {
        try {
            const result = await this.authService.login(requestBody);
            return result;
        }
        catch (error) {
            this.setStatus(401);
            throw new Error(error instanceof Error ? error.message : 'Login failed');
        }
    }
    async me(request) {
        try {
            const authHeader = request.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (!token) {
                this.setStatus(401);
                throw new Error('Access token required');
            }
            const decoded = this.tokenService.verifyToken(token);
            const user = await this.authService.getUserById(decoded.userId);
            return { user };
        }
        catch (error) {
            this.setStatus(401);
            throw new Error(error instanceof Error ? error.message : 'Invalid token');
        }
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, tsoa_1.Post)('register'),
    (0, tsoa_1.OperationId)('register'),
    (0, tsoa_1.Example)({
        message: 'User created successfully',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
            id: 'user-id',
            email: 'user@example.com',
            name: 'John Doe',
            lineId: null,
            roleId: 'role-id',
            createdAt: new Date(),
            updatedAt: new Date(),
            role: {
                id: 'role-id',
                name: 'USER',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        }
    }),
    (0, tsoa_1.Response)(400, 'Bad Request'),
    (0, tsoa_1.Response)(500, 'Internal Server Error'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, tsoa_1.Post)('login'),
    (0, tsoa_1.OperationId)('login'),
    (0, tsoa_1.Example)({
        message: 'Login successful',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
            id: 'user-id',
            email: 'user@example.com',
            name: 'John Doe',
            lineId: null,
            roleId: 'role-id',
            createdAt: new Date(),
            updatedAt: new Date(),
            role: {
                id: 'role-id',
                name: 'USER',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        }
    }),
    (0, tsoa_1.Response)(401, 'Invalid credentials'),
    (0, tsoa_1.Response)(500, 'Internal Server Error'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, tsoa_1.Get)('me'),
    (0, tsoa_1.OperationId)('getCurrentUser'),
    (0, tsoa_1.Security)('jwt'),
    (0, tsoa_1.Example)({
        user: {
            id: 'user-id',
            email: 'user@example.com',
            name: 'John Doe',
            lineId: null,
            roleId: 'role-id',
            createdAt: new Date(),
            updatedAt: new Date(),
            role: {
                id: 'role-id',
                name: 'USER',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        }
    }),
    (0, tsoa_1.Response)(401, 'Unauthorized'),
    (0, tsoa_1.Response)(403, 'Forbidden'),
    __param(0, (0, tsoa_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "me", null);
exports.AuthController = AuthController = __decorate([
    (0, tsoa_1.Route)('auth'),
    (0, tsoa_1.Tags)('Authentication'),
    __metadata("design:paramtypes", [])
], AuthController);
//# sourceMappingURL=AuthController.js.map