"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseUtils = void 0;
class ResponseUtils {
    static success(data, message) {
        return {
            success: true,
            data,
            message
        };
    }
    static error(error, message) {
        return {
            success: false,
            error,
            message
        };
    }
    static created(data, message) {
        return {
            success: true,
            data,
            message: message || 'Created successfully'
        };
    }
    static updated(data, message) {
        return {
            success: true,
            data,
            message: message || 'Updated successfully'
        };
    }
    static deleted(message) {
        return {
            success: true,
            message: message || 'Deleted successfully'
        };
    }
}
exports.ResponseUtils = ResponseUtils;
//# sourceMappingURL=response.js.map