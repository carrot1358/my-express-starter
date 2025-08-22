import { JWTPayload } from '../interfaces/auth.interface';
export declare class TokenService {
    private readonly JWT_SECRET;
    private readonly JWT_EXPIRES_IN;
    constructor();
    generateToken(userId: string): string;
    verifyToken(token: string): JWTPayload;
    decodeToken(token: string): JWTPayload | null;
}
//# sourceMappingURL=TokenService.d.ts.map