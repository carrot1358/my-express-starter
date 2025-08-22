import { Controller } from 'tsoa';
import { LineWebhookRequest } from '../interfaces/line.interface';
import { SuccessResponse } from '../interfaces/common.interface';
import { TsoaResponse } from 'tsoa';
export declare class LineController extends Controller {
    private lineService;
    constructor();
    callback(code: string, state?: string, response?: TsoaResponse<302, {
        location: string;
    }>): Promise<void>;
    webhook(requestBody: LineWebhookRequest): Promise<SuccessResponse>;
}
//# sourceMappingURL=LineController.d.ts.map