import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/lib/api/types';
import { StorefrontConfig } from '@/types/storefront';

export const storefrontService = {
  /**
   * Retrieves active storefront customization config from backend
   */
  async getConfig(): Promise<ApiResponse<StorefrontConfig>> {
    return apiClient.get<ApiResponse<StorefrontConfig>>('/storefront');
  },

  /**
   * Updates storefront layout, theme colors, hero banner and announcements
   */
  async updateConfig(config: Partial<StorefrontConfig>): Promise<ApiResponse<StorefrontConfig>> {
    return apiClient.put<ApiResponse<StorefrontConfig>>('/storefront', config);
  }
};
