import { apiClient } from '@/lib/api/client';
import { ApiResponse, PaginatedResponse } from '@/lib/api/types';
import { InvoiceB2B } from '@/types/b2b';

export interface RecalculateBoletoResult {
  invoiceId: string;
  invoiceNumber: string;
  originalAmount: number;
  penaltyAndInterestAmount: number;
  recalculatedAmount: number;
  originalDueDate: string;
  newDueDate: string;
  recalculatedBoletoUrl: string;
  linhaDigitavel: string;
  codigoBarrras: string;
  message: string;
}

export interface CreditLedgerEntry {
  id: string;
  companyId: string;
  orderId?: string;
  invoiceId?: string;
  type: string;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  createdAt: string;
}

export const invoicesService = {
  /**
   * Retrieves invoices and DANFEs for the company
   */
  async getInvoices(filters?: { companyId?: string; status?: string; page?: number; pageSize?: number }): Promise<PaginatedResponse<InvoiceB2B>> {
    return apiClient.get<PaginatedResponse<InvoiceB2B>>('/invoices', {
      params: filters ? { ...filters } : undefined,
    });
  },

  /**
   * Gets invoice by ID or invoice number
   */
  async getInvoiceById(idOrNumber: string): Promise<ApiResponse<InvoiceB2B>> {
    return apiClient.get<ApiResponse<InvoiceB2B>>(`/invoices/${idOrNumber}`);
  },

  /**
   * Generates or recalculates overdue boleto (2ª via com juros via API Bancária)
   */
  async recalculateBoleto(invoiceIdOrNumber: string): Promise<ApiResponse<RecalculateBoletoResult>> {
    return apiClient.post<ApiResponse<RecalculateBoletoResult>>(`/invoices/${invoiceIdOrNumber}/recalculate`);
  },

  /**
   * Liquidates/pays an invoice and releases credit
   */
  async payInvoice(id: string, paymentData?: { paidAmount?: number; paymentMethod?: string; transactionId?: string }): Promise<ApiResponse<InvoiceB2B>> {
    return apiClient.post<ApiResponse<InvoiceB2B>>(`/invoices/${id}/pay`, paymentData);
  },

  /**
   * Downloads XML of invoice from backend
   */
  async getInvoiceXml(invoiceIdOrNumber: string): Promise<string> {
    return apiClient.get<string>(`/invoices/${invoiceIdOrNumber}/xml`);
  },

  /**
   * Retrieves credit ledger / balance statement
   */
  async getCreditLedger(params?: { companyId?: string; page?: number; pageSize?: number }): Promise<PaginatedResponse<CreditLedgerEntry>> {
    return apiClient.get<PaginatedResponse<CreditLedgerEntry>>('/credit/ledger', {
      params: params ? { ...params } : undefined,
    });
  }
};
