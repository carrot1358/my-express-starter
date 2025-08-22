export interface ErrorResponse {
    error: string;
}
export interface SuccessResponse {
    message: string;
}
export interface PaginationQuery {
    page?: number;
    limit?: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
//# sourceMappingURL=common.interface.d.ts.map