import { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse, UserWithoutPassword } from '../interfaces/auth.interface';
export declare class AuthService {
    private prisma;
    private tokenService;
    constructor();
    register(data: RegisterRequest): Promise<RegisterResponse>;
    login(data: LoginRequest): Promise<LoginResponse>;
    getUserById(userId: string): Promise<UserWithoutPassword>;
    getUserByLineId(lineId: string): Promise<UserWithoutPassword | null>;
    createUserFromLine(lineId: string, name: string): Promise<UserWithoutPassword>;
}
//# sourceMappingURL=AuthService.d.ts.map