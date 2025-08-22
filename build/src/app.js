"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const routes_1 = require("../build/routes");
require('dotenv').config();
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check endpoint
app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello from TypeScript backend!' });
});
// Register TSOA routes
(0, routes_1.RegisterRoutes)(app);
// Swagger documentation
try {
    const swaggerDocument = require('../build/swagger.json');
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument, {
        explorer: true,
        customSiteTitle: 'LINE Backend API Documentation',
        customCss: '.swagger-ui .topbar { display: none }'
    }));
}
catch (error) {
    console.warn('Swagger documentation not available. Run build first.');
}
// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    if (err.status) {
        res.status(err.status).json({ error: err.message });
    }
    else {
        res.status(500).json({ error: 'Internal server error' });
    }
});
// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});
exports.default = app;
//# sourceMappingURL=app.js.map