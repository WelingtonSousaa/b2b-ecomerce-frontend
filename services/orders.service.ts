import { apiClient } from '@/lib/api/client';
import { ApiResponse, PaginatedResponse } from '@/lib/api/types';
import { OrderB2B, BranchDestinationAllocation, ScheduledDeliverySchedule, CompanyAddress, FreightType, PaymentType, UOM } from '@/types/b2b';

export interface CreateOrderPayload {
  companyId?: string;
  buyerUserId?: string;
  buyerUserName?: string;
  items: Array<{
    sku: string;
    cdId?: string;
    uom?: UOM;
    quantity: number;
    unitPrice?: number;
    customUnitPrice?: number;
  }>;
  freightType?: FreightType;
  carrierName?: string;
  carrierCnpj?: string;
  freightPrice?: number;
  paymentType?: PaymentType;
  installmentsCount?: number;
  paymentTerms?: string;
  shippingAddress?: CompanyAddress;
  notes?: string;

  // Frontend compatibility properties
  deliveryMode?: 'SINGLE' | 'MULTI_BRANCH';
  singleAddress?: CompanyAddress;
  branchAllocations?: BranchDestinationAllocation[];
  scheduleMode?: 'IMMEDIATE' | 'SCHEDULED';
  schedules?: ScheduledDeliverySchedule[];
  payment?: {
    type: string;
    installmentsCount?: number;
    terms?: string;
  };
  couponCode?: string;
  comments?: string;
}

export const ordersService = {
  /**
   * Places a B2B Order
   */
  async createOrder(payload: CreateOrderPayload): Promise<ApiResponse<OrderB2B>> {
    const backendPayload = {
      companyId: payload.companyId,
      buyerUserId: payload.buyerUserId,
      buyerUserName: payload.buyerUserName,
      items: payload.items.map((it) => ({
        sku: it.sku,
        cdId: it.cdId || 'cd-sp',
        uom: it.uom || 'UN',
        quantity: it.quantity,
        customUnitPrice: it.customUnitPrice || it.unitPrice,
      })),
      freightType: payload.freightType || 'CIF',
      carrierName: payload.carrierName,
      carrierCnpj: payload.carrierCnpj,
      freightPrice: payload.freightPrice || 0,
      paymentType: (payload.paymentType || payload.payment?.type || 'BOLETO_FATURADO') as PaymentType,
      installmentsCount: payload.installmentsCount || payload.payment?.installmentsCount || 1,
      paymentTerms: payload.paymentTerms || payload.payment?.terms,
      shippingAddress: payload.shippingAddress || payload.singleAddress,
      notes: payload.notes || payload.comments,
    };

    return apiClient.post<ApiResponse<OrderB2B>>('/orders', backendPayload);
  },

  /**
   * Retrieves corporate order history
   */
  async getOrders(filters?: { companyId?: string; userId?: string; status?: string; page?: number; pageSize?: number }): Promise<PaginatedResponse<OrderB2B>> {
    return apiClient.get<PaginatedResponse<OrderB2B>>('/orders', {
      params: filters ? { ...filters } : undefined,
    });
  },

  /**
   * Gets specific order by ID or orderNumber
   */
  async getOrderById(idOrNumber: string): Promise<ApiResponse<OrderB2B>> {
    return apiClient.get<ApiResponse<OrderB2B>>(`/orders/${idOrNumber}`);
  },

  /**
   * Approves a pending approval order (Alçada de compra)
   */
  async approveOrder(id: string, notes?: string): Promise<ApiResponse<OrderB2B>> {
    return apiClient.post<ApiResponse<OrderB2B>>(`/orders/${id}/approve`, { notes });
  },

  /**
   * Rejects a pending approval order
   */
  async rejectOrder(id: string, reason: string): Promise<ApiResponse<OrderB2B>> {
    return apiClient.post<ApiResponse<OrderB2B>>(`/orders/${id}/reject`, { reason });
  },

  /**
   * Cancels an order
   */
  async cancelOrder(id: string, reason: string): Promise<ApiResponse<OrderB2B>> {
    return apiClient.post<ApiResponse<OrderB2B>>(`/orders/${id}/cancel`, { reason });
  }
};
