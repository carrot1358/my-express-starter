import { User, Role } from '@prisma/client';
export interface LoginRequest {
    email: string;
    password: string;
}
export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}
export interface LoginResponse {
    message: string;
    token: string;
    user: UserWithoutPassword;
}
export interface RegisterResponse {
    message: string;
    token: string;
    user: UserWithoutPassword;
}
export interface UserWithoutPassword extends Omit<User, 'password'> {
    role: Role;
}
export interface MeResponse {
    user: UserWithoutPassword;
}
export { ErrorResponse } from './common.interface';
export interface JWTPayload {
    userId: string;
    iat?: number;
    exp?: number;
}
//# sourceMappingURL=auth.interface.d.ts.map