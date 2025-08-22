import { Controller } from 'tsoa';
import { CreateProductRequest, UpdateProductRequest, ProductResponse, CreateProductResponse, UpdateProductResponse, DeleteProductResponse } from '../interfaces/product.interface';
import express from 'express';
export declare class ProductController extends Controller {
    private productService;
    private tokenService;
    constructor();
    getAllProducts(): Promise<ProductResponse[]>;
    getProductById(id: string): Promise<ProductResponse>;
    createProduct(requestBody: CreateProductRequest, request: express.Request): Promise<CreateProductResponse>;
    updateProduct(id: string, requestBody: UpdateProductRequest, request: express.Request): Promise<UpdateProductResponse>;
    deleteProduct(id: string, request: express.Request): Promise<DeleteProductResponse>;
}
//# sourceMappingURL=ProductController.d.ts.map