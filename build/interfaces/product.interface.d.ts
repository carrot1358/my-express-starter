import { Product } from '@prisma/client';
export interface CreateProductRequest {
    name: string;
    description?: string;
    price: number;
}
export interface UpdateProductRequest {
    name?: string;
    description?: string;
    price?: number;
}
export interface ProductResponse extends Product {
    user: {
        id: string;
        name: string;
        email: string;
    };
}
export interface CreateProductResponse {
    message: string;
    product: ProductResponse;
}
export interface UpdateProductResponse {
    message: string;
    product: ProductResponse;
}
export interface DeleteProductResponse {
    message: string;
}
export interface ProductListResponse {
    products: ProductResponse[];
}
export { ErrorResponse } from './common.interface';
//# sourceMappingURL=product.interface.d.ts.map