import { ApiResponse } from '@/lib/api/types';
import { Branch, CompanyAccount, CompanyUser } from '@/types/b2b';
import { mockDb } from '@/lib/mockDb';

export interface LoginCredentials {
  email: string;
  password?: string;
  cnpj?: string;
}

export interface AuthResponseData {
  user: CompanyUser;
  company: CompanyAccount;
  accessToken: string;
}

// Initial Seed Data
const initialCompany: CompanyAccount = {
  id: '',
  cnpj: '',
  razaoSocial: '',
  nomeFantasia: '',
  industrySegment: '',
  inscricaoEstadual: '',
  inscricaoMunicipal: '',
  regimeTributario: 'SIMPLES_NACIONAL',
  suframaCode: '',
  hasSuframaIncentive: false,
  status: 'PENDING_ANALYSIS',
  creditLimitTotal: 0,
  creditLimitAvailable: 0,
  mainAddress: { logradouro: '', numero: '', bairro: '', cidade: '', uf: '', cep: '', pais: '' },
  branches: []
};

const initialUsers: CompanyUser[] = [];
const initialBranches: Branch[] = [];

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponseData>> {
    mockDb.init('b2b_users', initialUsers);
    mockDb.init('b2b_company', initialCompany);
    
    const users = mockDb.get('b2b_users');
    const user = users.find((u: any) => u.email === credentials.email) || { id: 'temp-user', name: 'Usuário Temporário', email: credentials.email, role: 'ADMIN', isActive: true };
    const company = mockDb.get('b2b_company');
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('b2b_auth_token', 'mock_token');
      localStorage.setItem('b2b_current_user', JSON.stringify(user));
    }
    return { success: true, data: { user, company, accessToken: 'mock_token' } };
  },

  async getProfile(): Promise<ApiResponse<{ user: CompanyUser; company: CompanyAccount }>> {
    mockDb.init('b2b_company', initialCompany);
    let user = null;
    if (typeof window !== 'undefined') {
      const u = localStorage.getItem('b2b_current_user');
      if (u) user = JSON.parse(u);
    }
    if (!user) user = { id: 'temp-user', name: 'Usuário Temporário', role: 'ADMIN', isActive: true };
    return { success: true, data: { user, company: mockDb.get('b2b_company') } };
  },

  async getCompanyBranches(companyId: string): Promise<ApiResponse<Branch[]>> {
    mockDb.init('b2b_branches', initialBranches);
    return { success: true, data: mockDb.get('b2b_branches') };
  },

  async addCompanyBranch(companyId: string, branchData: Partial<Branch>): Promise<ApiResponse<Branch>> {
    const branches = mockDb.get('b2b_branches') || [];
    const newBranch = { ...branchData, id: `branch-${Date.now()}` } as Branch;
    mockDb.set('b2b_branches', [newBranch, ...branches]);
    return { success: true, data: newBranch };
  },
  
  async deleteCompanyBranch(companyId: string, branchId: string): Promise<ApiResponse<void>> {
    const branches = mockDb.get('b2b_branches') || [];
    mockDb.set('b2b_branches', branches.filter((b: any) => b.id !== branchId));
    return { success: true, data: undefined };
  },

  async getCompanyUsers(companyId: string): Promise<ApiResponse<CompanyUser[]>> {
    mockDb.init('b2b_users', initialUsers);
    return { success: true, data: mockDb.get('b2b_users') };
  },

  async createCompanyUser(companyId: string, userData: Partial<CompanyUser>): Promise<ApiResponse<CompanyUser>> {
    const users = mockDb.get('b2b_users') || [];
    const newUser = { ...userData, id: `user-${Date.now()}`, companyId } as CompanyUser;
    mockDb.set('b2b_users', [newUser, ...users]);
    return { success: true, data: newUser };
  },
  
  async toggleCompanyUserStatus(companyId: string, userId: string): Promise<ApiResponse<CompanyUser>> {
    const users = mockDb.get('b2b_users') || [];
    const updated = users.map((u: any) => u.id === userId ? { ...u, isActive: !u.isActive } : u);
    mockDb.set('b2b_users', updated);
    return { success: true, data: updated.find((u: any) => u.id === userId) };
  },
  
  async deleteCompanyUser(companyId: string, userId: string): Promise<ApiResponse<void>> {
    const users = mockDb.get('b2b_users') || [];
    mockDb.set('b2b_users', users.filter((u: any) => u.id !== userId));
    return { success: true, data: undefined };
  }
};
