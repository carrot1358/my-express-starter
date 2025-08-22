import { ApiResponse } from '../interfaces/common.interface';
export declare class ResponseUtils {
    static success<T>(data: T, message?: string): ApiResponse<T>;
    static error(error: string, message?: string): ApiResponse;
    static created<T>(data: T, message?: string): ApiResponse<T>;
    static updated<T>(data: T, message?: string): ApiResponse<T>;
    static deleted(message?: string): ApiResponse;
}
//# sourceMappingURL=response.d.ts.map