'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CompanyAccount, CompanyUser } from '@/types/b2b';
import { authService } from '@/services/auth.service';

interface AuthContextType {
  user: CompanyUser | null;
  company: CompanyAccount | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  isEditCompanyModalOpen: boolean;
  authModalReason: string;
  login: (email?: string, password?: string, cnpj?: string) => Promise<void>;
  logout: () => void;
  register: (companyData: Partial<CompanyAccount>, userData: Partial<CompanyUser>, password?: string) => Promise<void>;
  updateCompany: (data: Partial<CompanyAccount>) => Promise<void>;
  openAuthModal: (reason?: string) => void;
  closeAuthModal: () => void;
  openEditCompanyModal: () => void;
  closeEditCompanyModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CompanyUser | null>(null);
  const [company, setCompany] = useState<CompanyAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEditCompanyModalOpen, setIsEditCompanyModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] = useState(
    'Você está no modo visitante. Entre com seu CNPJ para acessar o sistema completo.'
  );

  // Restore authenticated session from backend via JWT token
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      setIsLoading(false);
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email?: string, password?: string, cnpj?: string) => {
    // 1-Click Phantom Mock Login
    const mockUser: CompanyUser = {
      id: '1',
      name: 'João Compras',
      email: 'joao@techsolutions.com',
      role: 'ADMIN',
      isActive: true,
      companyId: '1'
    };

    const mockCompany: CompanyAccount = {
      id: '1',
      cnpj: '12.345.678/0001-90',
      razaoSocial: 'Tech Solutions B2B',
      nomeFantasia: 'Tech Solutions',
      inscricaoEstadual: '123456',
      regimeTributario: 'LUCRO_REAL',
      mainAddress: {
        logradouro: 'Rua das Flores',
        numero: '123',
        bairro: 'Centro',
        cidade: 'São Paulo',
        uf: 'SP',
        cep: '01001-000',
        pais: 'Brasil'
      },
      hasSuframaIncentive: false,
      status: 'APPROVED',
      creditLimitTotal: 50000,
      creditLimitAvailable: 50000,
      branches: []
    };

    setUser(mockUser);
    setCompany(mockCompany);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setCompany(null);
  };

  const register = async (companyData: Partial<CompanyAccount>, userData: Partial<CompanyUser>, password?: string) => {
    setUser(userData as CompanyUser);
    setCompany(companyData as CompanyAccount);
    setIsAuthModalOpen(false);
  };

  const updateCompany = async (data: Partial<CompanyAccount>) => {
    if (!company) return;
    setCompany({ ...company, ...data });
  };

  const openAuthModal = (reason?: string) => {
    if (reason) {
      setAuthModalReason(reason);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const openEditCompanyModal = () => {
    setIsEditCompanyModalOpen(true);
  };

  const closeEditCompanyModal = () => {
    setIsEditCompanyModalOpen(false);
  };

  const isAuthenticated = !!user && !!company;

  return (
    <AuthContext.Provider
      value={{
        user,
        company,
        isAuthenticated,
        isLoading,
        isAuthModalOpen,
        isEditCompanyModalOpen,
        authModalReason,
        login,
        logout,
        register,
        updateCompany,
        openAuthModal,
        closeAuthModal,
        openEditCompanyModal,
        closeEditCompanyModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
