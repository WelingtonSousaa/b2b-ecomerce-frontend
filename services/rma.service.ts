import { apiClient } from '@/lib/api/client';
import { ApiResponse, PaginatedResponse } from '@/lib/api/types';
import { RmaTicket, RmaItem } from '@/types/b2b';

export interface CreateRmaPayload {
  orderNumber: string;
  cdDestinationId: string;
  items: RmaItem[];
  companyId: string;
  comments?: string;
}

export const rmaService = {
  /**
   * Retrieves RMA return tickets
   */
  async getRmaTickets(filters?: { status?: string; page?: number }): Promise<PaginatedResponse<RmaTicket>> {
    return apiClient.get<PaginatedResponse<RmaTicket>>('/rma', {
      params: filters ? { ...filters } : undefined,
    });
  },

  /**
   * Opens a new RMA ticket and generates reverse shipping
   */
  async createRmaTicket(payload: CreateRmaPayload): Promise<ApiResponse<RmaTicket>> {
    return apiClient.post<ApiResponse<RmaTicket>>('/rma', payload);
  },

  /**
   * Gets specific RMA ticket by ID
   */
  async getRmaById(id: string): Promise<ApiResponse<RmaTicket>> {
    return apiClient.get<ApiResponse<RmaTicket>>(`/rma/${id}`);
  }
};
