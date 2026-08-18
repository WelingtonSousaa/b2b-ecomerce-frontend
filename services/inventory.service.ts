import { apiClient } from '@/lib/api/client';
import { ApiResponse, PaginatedResponse } from '@/lib/api/types';
import { StockMovement, StockByCD } from '@/types/b2b';

export interface StockAdjustmentInput {
  productId?: string;
  sku: string;
  variantInfo?: string;
  cdId: string;
  type: 'IN' | 'OUT';
  reason: string;
  reasonLabel?: string;
  quantity: number;
  fiscalDoc?: string;
  batchNumber?: string;
  operatorName?: string;
  notes?: string;
  // Aliases for compatibility
  operator?: string;
}

export const inventoryService = {
  /**
   * Retrieves stock levels across Multi-CDs for a SKU
   */
  async getStockBySku(sku: string): Promise<ApiResponse<StockByCD[]>> {
    return apiClient.get<ApiResponse<StockByCD[]>>('/inventory', {
      params: { sku },
    });
  },

  /**
   * Retrieves stock overview
   */
  async getStockOverview(sku?: string): Promise<ApiResponse<{ totalUnits?: number; skusCount?: number; stockByCD: StockByCD[] }>> {
    return apiClient.get<ApiResponse<{ totalUnits?: number; skusCount?: number; stockByCD: StockByCD[] }>>('/inventory', {
      params: sku ? { sku } : undefined,
    });
  },

  /**
   * Registers a manual stock movement (Entrada / Saída / Baixa)
   */
  async recordMovement(data: StockAdjustmentInput): Promise<ApiResponse<StockMovement>> {
    const payload = {
      productId: data.productId || 'prod-1',
      sku: data.sku,
      variantInfo: data.variantInfo,
      cdId: data.cdId,
      type: data.type,
      reason: data.reason,
      quantity: data.quantity,
      fiscalDoc: data.fiscalDoc,
      batchNumber: data.batchNumber,
      operatorName: data.operatorName || data.operator || 'Operador Logístico',
      notes: data.notes,
    };
    return apiClient.post<ApiResponse<StockMovement>>('/inventory/movements', payload);
  },

  /**
   * Retrieves Kardex movement audit history
   */
  async getKardexHistory(filters?: { sku?: string; cdId?: string; page?: number; pageSize?: number; type?: string }): Promise<PaginatedResponse<StockMovement>> {
    return apiClient.get<PaginatedResponse<StockMovement>>('/inventory/movements', {
      params: filters ? { ...filters } : undefined,
    });
  }
};
