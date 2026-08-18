import { apiClient } from '@/lib/api/client';
import { ApiResponse } from '@/lib/api/types';
import { Branch, CompanyAccount, CompanyUser } from '@/types/b2b';

export interface LoginCredentials {
  email: string;
  password?: string;
  cnpj?: string;
}

export interface AuthResponseData {
  user: CompanyUser;
  company: CompanyAccount;
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export const authService = {
  /**
   * Authenticates a B2B company user
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponseData>> {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/login', credentials);
    if (response.data?.accessToken && typeof window !== 'undefined') {
      localStorage.setItem('b2b_auth_token', response.data.accessToken);
    }
    return response;
  },

  /**
   * Registers a new Company & User
   */
  async register(data: {
    company: Partial<CompanyAccount>;
    user: Partial<CompanyUser>;
    password?: string;
  }): Promise<ApiResponse<AuthResponseData>> {
    const response = await apiClient.post<ApiResponse<AuthResponseData>>('/auth/register', data);
    if (response.data?.accessToken && typeof window !== 'undefined') {
      localStorage.setItem('b2b_auth_token', response.data.accessToken);
    }
    return response;
  },

  /**
   * Gets current authenticated profile
   */
  async getProfile(): Promise<ApiResponse<{ user: CompanyUser; company: CompanyAccount }>> {
    return apiClient.get<ApiResponse<{ user: CompanyUser; company: CompanyAccount }>>('/auth/me');
  },

  /**
   * Gets company corporate info by ID
   */
  async getCompanyById(companyId: string): Promise<ApiResponse<CompanyAccount>> {
    return apiClient.get<ApiResponse<CompanyAccount>>(`/companies/${companyId}`);
  },

  /**
   * Gets company corporate info by CNPJ
   */
  async getCompanyByCnpj(cnpj: string): Promise<ApiResponse<CompanyAccount>> {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    return apiClient.get<ApiResponse<CompanyAccount>>(`/companies/cnpj/${cleanCnpj}`);
  },

  /**
   * Updates company corporate info
   */
  async updateCompany(companyId: string, data: Partial<CompanyAccount>): Promise<ApiResponse<CompanyAccount>> {
    return apiClient.put<ApiResponse<CompanyAccount>>(`/companies/${companyId}`, data);
  },

  /**
   * Lists branches belonging to a company
   */
  async getCompanyBranches(companyId: string): Promise<ApiResponse<Branch[]>> {
    return apiClient.get<ApiResponse<Branch[]>>(`/companies/${companyId}/branches`);
  },

  /**
   * Adds a branch to a company
   */
  async addCompanyBranch(companyId: string, data: Partial<Branch>): Promise<ApiResponse<Branch>> {
    return apiClient.post<ApiResponse<Branch>>(`/companies/${companyId}/branches`, data);
  },

  /**
   * Unlinks a branch from a company
   */
  async deleteCompanyBranch(companyId: string, branchId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/companies/${companyId}/branches/${branchId}`);
  },

  /**
   * Lists users belonging to a company
   */
  async getCompanyUsers(companyId: string): Promise<ApiResponse<CompanyUser[]>> {
    return apiClient.get<ApiResponse<CompanyUser[]>>(`/companies/${companyId}/users`);
  },

  /**
   * Creates a user in a company
   */
  async createCompanyUser(companyId: string, data: Partial<CompanyUser> & { password?: string }): Promise<ApiResponse<CompanyUser>> {
    return apiClient.post<ApiResponse<CompanyUser>>(`/companies/${companyId}/users`, data);
  },

  /**
   * Updates a company user's permissions or spending limit
   */
  async updateCompanyUser(companyId: string, userId: string, data: Partial<CompanyUser>): Promise<ApiResponse<CompanyUser>> {
    return apiClient.put<ApiResponse<CompanyUser>>(`/companies/${companyId}/users/${userId}`, data);
  },

  /**
   * Toggles a user's active status
   */
  async toggleCompanyUserStatus(companyId: string, userId: string): Promise<ApiResponse<CompanyUser>> {
    return apiClient.patch<ApiResponse<CompanyUser>>(`/companies/${companyId}/users/${userId}/status`);
  },

  /**
   * Revokes access and deletes a user
   */
  async deleteCompanyUser(companyId: string, userId: string): Promise<ApiResponse<void>> {
    return apiClient.delete<ApiResponse<void>>(`/companies/${companyId}/users/${userId}`);
  },

  /**
   * Logs out user and cleans local session
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('b2b_auth_token');
      sessionStorage.removeItem('b2b_auth_token');
    }
  }
};
