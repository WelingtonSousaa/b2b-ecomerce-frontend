'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { X, Lock, ArrowRight, AlertCircle, Loader2, UserPlus } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AuthRequiredModal() {
  const { isAuthModalOpen, closeAuthModal, authModalReason, login } = useAuth();

  // Login form state
  const [email, setEmail] = useState('carlos.compras@techsolutions.com.br');
  const [password, setPassword] = useState('password123');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await login(email, password);
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Credenciais inválidas. Verifique seu e-mail e senha.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await login('carlos.compras@techsolutions.com.br', 'password123');
    } catch (err: unknown) {
      setLoginError(err instanceof Error ? err.message : 'Erro ao autenticar demonstração.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden relative">
        
        {/* Header Bar */}
        <div className="bg-[#2563eb] text-white p-7 sm:p-8 relative">
          <button
            onClick={closeAuthModal}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-amber-300">
              Acesso Corporativo B2B
            </span>
          </div>

          <h3 className="text-2xl font-black tracking-tight leading-tight">
            Entrar na sua Conta
          </h3>

          <p className="text-xs sm:text-sm text-blue-100/90 mt-1.5 leading-relaxed font-medium">
            {authModalReason || 'Você está no modo visitante. Entre com seu CNPJ para acessar o sistema completo.'}
          </p>
        </div>

        {/* Modal Body - LOGIN EXCLUSIVO */}
        <div className="p-7 sm:p-8 space-y-5 text-xs">
          
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div>
              <label className="font-bold text-gray-700 block mb-1.5 text-xs">E-mail Corporativo</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ex: compras@empresa.com.br"
                className="w-full bg-[#f5f6f6] border border-gray-200 focus:border-[#2563eb] rounded-xl px-4 py-3.5 text-xs font-medium focus:outline-none focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1.5 text-xs">Senha de Acesso</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#f5f6f6] border border-gray-200 focus:border-[#2563eb] rounded-xl px-4 py-3.5 text-xs font-medium focus:outline-none focus:bg-white transition-colors"
              />
            </div>

            <div className="pt-2 space-y-2.5">
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs py-4 rounded-full transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 hover:scale-101"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Autenticando...</span>
                  </>
                ) : (
                  <>
                    <span>Acessar Plataforma</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={isLoggingIn}
                onClick={handleQuickDemoLogin}
                className="w-full bg-[#f5f6f6] hover:bg-gray-200 text-[#2563eb] font-bold text-xs py-3 rounded-full transition-colors cursor-pointer border border-blue-200"
              >
                Entrar em 1 Clique (Demonstração)
              </button>
            </div>
          </form>

          {/* Redirecionamento para a página dedicada de cadastro */}
          <div className="pt-4 border-t border-gray-100 text-center space-y-2.5">
            <p className="text-gray-500 text-xs">Sua empresa ainda não possui conta?</p>
            <Link
              href="/cadastro"
              onClick={closeAuthModal}
              className="w-full bg-blue-50 hover:bg-blue-100 text-[#2563eb] font-bold text-xs py-3.5 rounded-full transition-colors inline-flex items-center justify-center gap-2 border border-blue-200"
            >
              <UserPlus className="w-4 h-4" />
              <span>Cadastre sua Empresa →</span>
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
