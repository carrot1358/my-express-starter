export interface LineProfile {
    userId: string;
    displayName: string;
    pictureUrl?: string;
    statusMessage?: string;
}
export interface LineTokenResponse {
    access_token: string;
    expires_in: number;
    id_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
}
export interface LineMessage {
    id: string;
    type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'location' | 'sticker';
    text?: string;
}
export interface LineEvent {
    type: 'message' | 'follow' | 'unfollow' | 'postback';
    replyToken: string;
    source: {
        type: 'user' | 'group' | 'room';
        userId?: string;
        groupId?: string;
        roomId?: string;
    };
    timestamp: number;
    message?: LineMessage;
}
export interface LineWebhookRequest {
    destination: string;
    events: LineEvent[];
}
export interface LineCallbackQuery {
    code: string;
    state?: string;
    error?: string;
    error_description?: string;
}
export interface LineCallbackResponse {
    message: string;
    user?: {
        id: string;
        name: string;
        email: string;
    };
    token?: string;
}
export { ErrorResponse } from './common.interface';
//# sourceMappingURL=line.interface.d.ts.map