import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/lib/api/types';
import { PriceBook, PriceBookItem } from '@/types/b2b';

export const priceBooksService = {
  /**
   * Retrieves active price books (optionally filtered by CNPJ)
   */
  async getPriceBooks(cnpj?: string): Promise<ApiResponse<PriceBook[]>> {
    return apiClient.get<ApiResponse<PriceBook[]>>('/price-books', {
      params: cnpj ? { cnpj: cnpj.replace(/\D/g, '') } : undefined,
    });
  },

  /**
   * Retrieves single price book by ID or Code
   */
  async getPriceBookById(idOrCode: string): Promise<ApiResponse<PriceBook>> {
    return apiClient.get<ApiResponse<PriceBook>>(`/price-books/${idOrCode}`);
  },

  /**
   * Retrieves applicable price book for a specific CNPJ
   */
  async getPriceBookForCnpj(cnpj: string): Promise<ApiResponse<PriceBook | null>> {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    const response = await apiClient.get<ApiResponse<PriceBook[]>>('/price-books', {
      params: { cnpj: cleanCnpj },
    });

    const firstBook = response.data && response.data.length > 0 ? response.data[0] : null;
    return {
      ...response,
      data: firstBook,
    };
  },

  /**
   * Creates a new custom price book
   */
  async createPriceBook(data: Partial<PriceBook>): Promise<ApiResponse<PriceBook>> {
    return apiClient.post<ApiResponse<PriceBook>>('/price-books', data);
  },

  /**
   * Updates an existing price book
   */
  async updatePriceBook(id: string, data: Partial<PriceBook>): Promise<ApiResponse<PriceBook>> {
    return apiClient.put<ApiResponse<PriceBook>>(`/price-books/${id}`, data);
  },

  /**
   * Adds an item with negotiated price to a price book
   */
  async addItemToPriceBook(id: string, item: Partial<PriceBookItem>): Promise<ApiResponse<PriceBook>> {
    return apiClient.post<ApiResponse<PriceBook>>(`/price-books/${id}/items`, item);
  },

  /**
   * Removes a price book
   */
  async deletePriceBook(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/price-books/${id}`);
  }
};
