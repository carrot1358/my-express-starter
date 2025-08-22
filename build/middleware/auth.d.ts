import express from 'express';
export interface AuthenticatedRequest extends express.Request {
    user?: {
        id: string;
        email: string;
        name: string;
        lineId: string | null;
        roleId: string;
        createdAt: Date;
        updatedAt: Date;
        role: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
        };
    };
}
export declare const authenticateToken: (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => Promise<void>;
export declare const requireRole: (roleName: string) => (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => void;
export declare const requireAdmin: (req: AuthenticatedRequest, res: express.Response, next: express.NextFunction) => void;
export declare function expressAuthentication(request: express.Request, securityName: string, scopes?: string[]): Promise<any>;
//# sourceMappingURL=auth.d.ts.map