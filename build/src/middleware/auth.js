"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireRole = exports.authenticateToken = void 0;
exports.expressAuthentication = expressAuthentication;
const client_1 = require("@prisma/client");
const TokenService_1 = require("../services/TokenService");
const prisma = new client_1.PrismaClient();
const tokenService = new TokenService_1.TokenService();
const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        res.status(401).json({ error: 'Access token required' });
        return;
    }
    try {
        const decoded = tokenService.verifyToken(token);
        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            include: { role: true }
        });
        if (!user) {
            res.status(401).json({ error: 'Invalid token' });
            return;
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(403).json({ error: 'Invalid or expired token' });
        return;
    }
};
exports.authenticateToken = authenticateToken;
const requireRole = (roleName) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        if (req.user.role.name !== roleName) {
            res.status(403).json({ error: `${roleName} role required` });
            return;
        }
        next();
    };
};
exports.requireRole = requireRole;
exports.requireAdmin = (0, exports.requireRole)('ADMIN');
// TSOA authentication handler
function expressAuthentication(request, securityName, scopes) {
    if (securityName === 'jwt') {
        return new Promise((resolve, reject) => {
            (0, exports.authenticateToken)(request, {}, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(request.user);
                }
            });
        });
    }
    return Promise.reject(new Error('Invalid security name'));
}
//# sourceMappingURL=auth.js.map