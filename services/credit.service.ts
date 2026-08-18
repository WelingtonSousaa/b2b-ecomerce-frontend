import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/lib/api/types';
import { CreditLimitRequest } from '@/types/b2b';

export interface CreateCreditRequestInput {
  companyId?: string;
  requestedAmount: number;
  justification?: string;
  // Aliases for compatibility
  annualRevenue?: number;
  preferredTerms?: string;
  financialContact?: string;
}

export const creditService = {
  /**
   * Requests an increase in company credit limit
   */
  async requestLimitIncrease(data: CreateCreditRequestInput): Promise<ApiResponse<CreditLimitRequest>> {
    const payload = {
      companyId: data.companyId,
      requestedAmount: data.requestedAmount,
      justification:
        data.justification ||
        `Faturamento Anual: R$ ${data.annualRevenue || 0} | Condições: ${data.preferredTerms || 'Boleto 30/60/90'} | Contato: ${data.financialContact || 'Financeiro'}`,
    };
    return apiClient.post<ApiResponse<CreditLimitRequest>>('/credit/requests', payload);
  },

  /**
   * Gets credit requests history
   */
  async getCreditRequests(companyId?: string): Promise<ApiResponse<CreditLimitRequest[]>> {
    return apiClient.get<ApiResponse<CreditLimitRequest[]>>('/credit/requests', {
      params: companyId ? { companyId } : undefined,
    });
  },

  /**
   * Approves a credit limit request (Admin / Approver)
   */
  async approveCreditRequest(id: string, approvedAmount?: number): Promise<ApiResponse<CreditLimitRequest>> {
    return apiClient.post<ApiResponse<CreditLimitRequest>>(`/credit/requests/${id}/approve`, { approvedAmount });
  },

  /**
   * Rejects a credit limit request (Admin / Approver)
   */
  async rejectCreditRequest(id: string, reason: string): Promise<ApiResponse<CreditLimitRequest>> {
    return apiClient.post<ApiResponse<CreditLimitRequest>>(`/credit/requests/${id}/reject`, { reason });
  }
};
