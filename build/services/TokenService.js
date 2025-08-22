"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class TokenService {
    constructor() {
        this.JWT_SECRET = process.env.JWT_SECRET || 'default-secret';
        this.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
    }
    generateToken(userId) {
        return jsonwebtoken_1.default.sign({ userId }, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
    }
    verifyToken(token) {
        return jsonwebtoken_1.default.verify(token, this.JWT_SECRET);
    }
    decodeToken(token) {
        try {
            return jsonwebtoken_1.default.decode(token);
        }
        catch (error) {
            return null;
        }
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=TokenService.js.map