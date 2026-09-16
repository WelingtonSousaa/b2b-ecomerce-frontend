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
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('b2b_auth_token');
          if (token) {
            const profileRes = await authService.getProfile();
            if (isMounted && profileRes.data?.user && profileRes.data?.company) {
              setUser(profileRes.data.user);
              setCompany(profileRes.data.company);
            }
          }
        }
      } catch {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('b2b_auth_token');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = async (email?: string, password?: string, cnpj?: string) => {
    const targetEmail = email || 'carlos.compras@techsolutions.com.br';
    const targetPassword = password || 'password123';

    const response = await authService.login({
      email: targetEmail,
      password: targetPassword,
      cnpj,
    });

    if (response.data?.user && response.data?.company) {
      setUser(response.data.user);
      setCompany(response.data.company);
      setIsAuthModalOpen(false);
    }
  };

  const logout = () => {
    setUser(null);
    setCompany(null);
  };

  const register = async (companyData: Partial<CompanyAccount>, userData: Partial<CompanyUser>, password?: string) => {
    // Mock register
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
