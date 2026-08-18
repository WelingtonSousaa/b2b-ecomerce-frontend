import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/lib/api/types';
import { RFQRequest } from '@/types/b2b';

export const rfqService = {
  /**
   * Submits a Request for Quote (RFQ)
   */
  async submitRFQ(data: {
    items: Array<{ sku: string; quantity: number; targetPrice?: number }>;
    comments?: string;
  }): Promise<ApiResponse<RFQRequest>> {
    return apiClient.post<ApiResponse<RFQRequest>>('/rfq', data);
  },

  /**
   * Retrieves user quotes
   */
  async getQuotes(): Promise<ApiResponse<RFQRequest[]>> {
    return apiClient.get<ApiResponse<RFQRequest[]>>('/rfq');
  }
};
