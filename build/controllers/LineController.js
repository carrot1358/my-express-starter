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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineController = void 0;
const tsoa_1 = require("tsoa");
const LineService_1 = require("../services/LineService");
let LineController = class LineController extends tsoa_1.Controller {
    constructor() {
        super();
        this.lineService = new LineService_1.LineService();
    }
    async callback(code, state, response) {
        try {
            if (!code) {
                this.setStatus(400);
                throw new Error('No code provided');
            }
            const result = await this.lineService.handleCallback(code);
            // Redirect to frontend with token and user info
            const redirectUrl = `http://localhost:3000/profile/?name=${encodeURIComponent(result.user?.name || '')}&token=${encodeURIComponent(result.token || '')}`;
            if (response) {
                response(302, { location: redirectUrl });
            }
        }
        catch (error) {
            this.setStatus(500);
            // Redirect to frontend with error
            const errorUrl = `http://localhost:3000/profile/?error=${encodeURIComponent(error instanceof Error ? error.message : 'LINE callback failed')}`;
            if (response) {
                response(302, { location: errorUrl });
            }
        }
    }
    async webhook(requestBody) {
        try {
            await this.lineService.handleWebhook(requestBody);
            return {
                message: 'Webhook processed successfully'
            };
        }
        catch (error) {
            this.setStatus(500);
            throw new Error(error instanceof Error ? error.message : 'Webhook processing failed');
        }
    }
};
exports.LineController = LineController;
__decorate([
    (0, tsoa_1.Get)('callback'),
    (0, tsoa_1.OperationId)('lineCallback'),
    (0, tsoa_1.Example)('Redirect to frontend with token'),
    (0, tsoa_1.Response)(400, 'Bad Request - No code provided'),
    (0, tsoa_1.Response)(500, 'Internal Server Error'),
    __param(0, (0, tsoa_1.Query)()),
    __param(1, (0, tsoa_1.Query)()),
    __param(2, (0, tsoa_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Function]),
    __metadata("design:returntype", Promise)
], LineController.prototype, "callback", null);
__decorate([
    (0, tsoa_1.Post)('webhook'),
    (0, tsoa_1.OperationId)('lineWebhook'),
    (0, tsoa_1.Example)({
        message: 'Webhook processed successfully'
    }),
    (0, tsoa_1.Response)(400, 'Bad Request'),
    (0, tsoa_1.Response)(500, 'Internal Server Error'),
    __param(0, (0, tsoa_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LineController.prototype, "webhook", null);
exports.LineController = LineController = __decorate([
    (0, tsoa_1.Route)('line'),
    (0, tsoa_1.Tags)('LINE Integration'),
    __metadata("design:paramtypes", [])
], LineController);
//# sourceMappingURL=LineController.js.map