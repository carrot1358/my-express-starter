"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = require("@prisma/client");
const TokenService_1 = require("./TokenService");
class AuthService {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.tokenService = new TokenService_1.TokenService();
    }
    async register(data) {
        const { email, password, name } = data;
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email }
        });
        if (existingUser) {
            throw new Error('User already exists');
        }
        // Get default USER role
        const userRole = await this.prisma.role.findUnique({
            where: { name: 'USER' }
        });
        if (!userRole) {
            throw new Error('Default role not found');
        }
        // Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        // Create user
        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                roleId: userRole.id
            },
            include: { role: true }
        });
        // Generate token
        const token = this.tokenService.generateToken(user.id);
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        return {
            message: 'User created successfully',
            token,
            user: userWithoutPassword
        };
    }
    async login(data) {
        const { email, password } = data;
        // Find user with role
        const user = await this.prisma.user.findUnique({
            where: { email },
            include: { role: true }
        });
        if (!user || !user.password) {
            throw new Error('Invalid credentials');
        }
        // Verify password
        const validPassword = await bcryptjs_1.default.compare(password, user.password);
        if (!validPassword) {
            throw new Error('Invalid credentials');
        }
        // Generate token
        const token = this.tokenService.generateToken(user.id);
        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        return {
            message: 'Login successful',
            token,
            user: userWithoutPassword
        };
    }
    async getUserById(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: { role: true }
        });
        if (!user) {
            throw new Error('User not found');
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async getUserByLineId(lineId) {
        const user = await this.prisma.user.findUnique({
            where: { lineId },
            include: { role: true }
        });
        if (!user) {
            return null;
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    async createUserFromLine(lineId, name) {
        // Get default USER role
        const userRole = await this.prisma.role.findUnique({
            where: { name: 'USER' }
        });
        if (!userRole) {
            throw new Error('Default role not found');
        }
        // Create user
        const user = await this.prisma.user.create({
            data: {
                email: `${lineId}@line.user`,
                name,
                lineId,
                roleId: userRole.id
            },
            include: { role: true }
        });
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map