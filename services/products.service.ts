import { apiClient } from '@/lib/api/client';
import { ApiResponse, PaginatedResponse } from '@/lib/api/types';
import { Product } from '@/types/b2b';

export interface ProductFilters {
  category?: string;
  search?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  page?: number;
  pageSize?: number;
}

export const productsService = {
  /**
   * Retrieves catalog products with filtering and pagination
   */
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    return apiClient.get<PaginatedResponse<Product>>('/products', {
      params: filters ? { ...filters } : undefined,
    });
  },

  /**
   * Gets a specific product by SKU or slug
   */
  async getProductBySku(skuOrSlug: string): Promise<ApiResponse<Product>> {
    return apiClient.get<ApiResponse<Product>>(`/products/${skuOrSlug}`);
  },

  /**
   * Creates a new product (Simple or Multi-variant)
   */
  async createProduct(productData: Partial<Product>): Promise<ApiResponse<Product>> {
    return apiClient.post<ApiResponse<Product>>('/products', productData);
  },

  /**
   * Updates an existing product
   */
  async updateProduct(id: string, productData: Partial<Product>): Promise<ApiResponse<Product>> {
    return apiClient.put<ApiResponse<Product>>(`/products/${id}`, productData);
  },

  /**
   * Deletes a product from seller catalog
   */
  async deleteProduct(id: string): Promise<ApiResponse<{ deletedId: string }>> {
    return apiClient.delete<ApiResponse<{ deletedId: string }>>(`/products/${id}`);
  }
};
