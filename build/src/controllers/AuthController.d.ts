import { Controller } from 'tsoa';
import { LoginRequest, RegisterRequest, LoginResponse, RegisterResponse, MeResponse } from '../interfaces/auth.interface';
import express from 'express';
export declare class AuthController extends Controller {
    private authService;
    private tokenService;
    constructor();
    register(requestBody: RegisterRequest): Promise<RegisterResponse>;
    login(requestBody: LoginRequest): Promise<LoginResponse>;
    me(request: express.Request): Promise<MeResponse>;
}
//# sourceMappingURL=AuthController.d.ts.map