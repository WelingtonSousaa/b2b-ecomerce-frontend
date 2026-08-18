import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/lib/api/types';
import { SupplyContract } from '@/types/b2b';

export interface SignContractInput {
  signedBy: string;
  certificateIssuer?: string;
  documentSha256?: string;
  // Backward compatibility alias
  signerName?: string;
  certificate?: string;
}

export const contractsService = {
  /**
   * Retrieves active B2B supply contracts for a company
   */
  async getContracts(buyerCompanyId?: string): Promise<ApiResponse<SupplyContract[]>> {
    return apiClient.get<ApiResponse<SupplyContract[]>>('/contracts', {
      params: buyerCompanyId ? { buyerCompanyId } : undefined,
    });
  },

  /**
   * Gets specific contract by ID or contractNumber
   */
  async getContractById(idOrNumber: string): Promise<ApiResponse<SupplyContract>> {
    return apiClient.get<ApiResponse<SupplyContract>>(`/contracts/${idOrNumber}`);
  },

  /**
   * Signs a supply contract digitally (ICP-Brasil)
   */
  async signContract(idOrNumber: string, signatureData: SignContractInput): Promise<ApiResponse<SupplyContract>> {
    const payload = {
      signedBy: signatureData.signedBy || signatureData.signerName || 'Representante Legal',
      certificateIssuer: signatureData.certificateIssuer || signatureData.certificate || 'ICP-Brasil / Certisign Digital',
      documentSha256: signatureData.documentSha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    };
    return apiClient.post<ApiResponse<SupplyContract>>(`/contracts/${idOrNumber}/sign`, payload);
  }
};
