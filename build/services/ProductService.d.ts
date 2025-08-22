import { CreateProductRequest, UpdateProductRequest, ProductResponse, CreateProductResponse, UpdateProductResponse, DeleteProductResponse } from '../interfaces/product.interface';
export declare class ProductService {
    private prisma;
    constructor();
    getAllProducts(): Promise<ProductResponse[]>;
    getProductById(id: string): Promise<ProductResponse>;
    createProduct(data: CreateProductRequest, userId: string): Promise<CreateProductResponse>;
    updateProduct(id: string, data: UpdateProductRequest): Promise<UpdateProductResponse>;
    deleteProduct(id: string): Promise<DeleteProductResponse>;
}
//# sourceMappingURL=ProductService.d.ts.map