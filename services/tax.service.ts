import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/lib/api/types';
import { TaxBreakdown } from '@/types/b2b';

export interface CalculateTaxItemInput {
  sku: string;
  unitPrice: number;
  quantity: number;
  originCdUf?: string;
}

export interface CalculateTaxRequestPayload {
  companyId?: string;
  companyCnpj?: string;
  destinationUf: string;
  hasSuframaIncentive?: boolean;
  items: CalculateTaxItemInput[];
}

export interface CartTaxSummaryResponse {
  subtotal: number;
  totalIpi: number;
  totalIcmsSt: number;
  totalDifal: number;
  totalTaxes: number;
  grandTotal: number;
  items: Array<{
    sku: string;
    unitPrice: number;
    quantity: number;
    itemSubtotal: number;
    taxBreakdown: TaxBreakdown;
    totalItemTaxes: number;
    itemFinalTotal: number;
  }>;
}

export const taxService = {
  /**
   * Calculates official tax memory for cart items via Spring Boot backend
   */
  async calculateTaxes(payload: CalculateTaxRequestPayload): Promise<ApiResponse<CartTaxSummaryResponse>> {
    return apiClient.post<ApiResponse<CartTaxSummaryResponse>>('/tax/calculate', payload);
  }
};
