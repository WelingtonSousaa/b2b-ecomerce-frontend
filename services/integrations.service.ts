import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/lib/api/types';
import { ErpIntegration, WebhookLog } from '@/types/b2b';

export const integrationsService = {
  /**
   * Retrieves active ERP connectors status
   */
  async getIntegrations(): Promise<ApiResponse<ErpIntegration[]>> {
    return apiClient.get<ApiResponse<ErpIntegration[]>>('/integrations/erp');
  },

  /**
   * Triggers manual synchronization with external ERPs
   */
  async triggerSync(erpId?: string): Promise<ApiResponse<{ synced: boolean; timestamp: string }>> {
    return apiClient.post<ApiResponse<{ synced: boolean; timestamp: string }>>('/integrations/erp/sync', { erpId });
  },

  /**
   * Retrieves live webhook logs
   */
  async getWebhookLogs(): Promise<ApiResponse<WebhookLog[]>> {
    return apiClient.get<ApiResponse<WebhookLog[]>>('/integrations/webhooks/logs');
  }
};
