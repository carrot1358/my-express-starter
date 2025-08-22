import { LineWebhookRequest, LineCallbackResponse } from '../interfaces/line.interface';
export declare class LineService {
    private authService;
    private tokenService;
    private readonly LINE_CHANNEL_ID;
    private readonly LINE_CHANNEL_SECRET;
    private readonly LINE_CALLBACK_URL;
    private readonly LINE_MESSAGING_TOKEN;
    constructor();
    handleCallback(code: string): Promise<LineCallbackResponse>;
    handleWebhook(webhookData: LineWebhookRequest): Promise<void>;
    private getAccessToken;
    private getUserProfile;
    private processEvent;
    private handleTextMessage;
    private replyMessage;
}
//# sourceMappingURL=LineService.d.ts.map