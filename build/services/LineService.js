"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LineService = void 0;
const axios_1 = __importDefault(require("axios"));
const AuthService_1 = require("./AuthService");
const TokenService_1 = require("./TokenService");
class LineService {
    constructor() {
        this.authService = new AuthService_1.AuthService();
        this.tokenService = new TokenService_1.TokenService();
        this.LINE_CHANNEL_ID = process.env.LINE_CHANNEL_ID || '';
        this.LINE_CHANNEL_SECRET = process.env.LINE_CHANNEL_SECRET || '';
        this.LINE_CALLBACK_URL = process.env.LINE_CALLBACK_URL || '';
        this.LINE_MESSAGING_TOKEN = process.env.LINE_MESSAGING_TOKEN || '';
    }
    async handleCallback(code) {
        try {
            // Exchange code for access token
            const tokenResponse = await this.getAccessToken(code);
            // Get user profile from LINE
            const profile = await this.getUserProfile(tokenResponse.access_token);
            // Check if user exists in our database
            let user = await this.authService.getUserByLineId(profile.userId);
            // Create user if doesn't exist
            if (!user) {
                user = await this.authService.createUserFromLine(profile.userId, profile.displayName);
            }
            // Generate JWT token for our app
            const jwtToken = this.tokenService.generateToken(user.id);
            return {
                message: 'LINE login successful',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email
                },
                token: jwtToken
            };
        }
        catch (error) {
            throw new Error(error instanceof Error ? error.message : 'LINE callback failed');
        }
    }
    async handleWebhook(webhookData) {
        try {
            for (const event of webhookData.events) {
                await this.processEvent(event);
            }
        }
        catch (error) {
            console.error('LINE webhook error:', error);
            throw new Error('Webhook processing failed');
        }
    }
    async getAccessToken(code) {
        const response = await axios_1.default.post('https://api.line.me/oauth2/v2.1/token', new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: this.LINE_CALLBACK_URL,
            client_id: this.LINE_CHANNEL_ID,
            client_secret: this.LINE_CHANNEL_SECRET,
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        return response.data;
    }
    async getUserProfile(accessToken) {
        const response = await axios_1.default.get('https://api.line.me/v2/profile', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return response.data;
    }
    async processEvent(event) {
        if (event.type === 'message' && event.message?.type === 'text') {
            await this.handleTextMessage(event);
        }
        // Handle other event types as needed
    }
    async handleTextMessage(event) {
        if (!event.message?.text || !event.replyToken) {
            return;
        }
        const userMessage = event.message.text;
        const replyMessage = `คุณพิมพ์ว่า: ${userMessage}`;
        await this.replyMessage(event.replyToken, replyMessage);
    }
    async replyMessage(replyToken, message) {
        await axios_1.default.post('https://api.line.me/v2/bot/message/reply', {
            replyToken: replyToken,
            messages: [
                {
                    type: 'text',
                    text: message,
                },
            ],
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.LINE_MESSAGING_TOKEN}`,
            },
        });
    }
}
exports.LineService = LineService;
//# sourceMappingURL=LineService.js.map