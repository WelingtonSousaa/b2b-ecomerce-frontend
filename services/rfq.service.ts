import { ApiResponse } from '@/lib/api/types';
import { RFQRequest } from '@/types/b2b';
import { mockDb } from '@/lib/mockDb';

const initialQuotes: RFQRequest[] = [];

export const rfqService = {
  async getQuotes(): Promise<ApiResponse<RFQRequest[]>> {
    mockDb.init('b2b_quotes', initialQuotes);
    return { success: true, data: mockDb.get('b2b_quotes') };
  },

  async createQuote(data: Partial<RFQRequest>): Promise<ApiResponse<RFQRequest>> {
    const quotes = mockDb.get('b2b_quotes') || [];
    const newQuote = { ...data, id: `rfq-${Date.now()}`, createdAt: new Date().toISOString(), status: 'PENDING' } as RFQRequest;
    mockDb.set('b2b_quotes', [newQuote, ...quotes]);
    return { success: true, data: newQuote };
  }
};
