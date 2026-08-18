import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/lib/api/types';
import { B2BNotification } from '@/types/b2b';

export const notificationsService = {
  /**
   * Retrieves user notifications
   */
  async getNotifications(): Promise<ApiResponse<B2BNotification[]>> {
    return apiClient.get<ApiResponse<B2BNotification[]>>('/notifications');
  },

  /**
   * Marks a notification as read
   */
  async markAsRead(id: string): Promise<ApiResponse<{ id: string; isRead: boolean }>> {
    return apiClient.patch<ApiResponse<{ id: string; isRead: boolean }>>(`/notifications/${id}/read`);
  },

  /**
   * Marks all notifications as read
   */
  async markAllAsRead(): Promise<ApiResponse<{ markedCount: number }>> {
    return apiClient.post<ApiResponse<{ markedCount: number }>>('/notifications/read-all');
  }
};
