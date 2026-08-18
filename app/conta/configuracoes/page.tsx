'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Settings,
  Bell,
  Mail,
  Shield,
  CheckCircle2,
  Building2,
  Lock,
  Smartphone,
  Save,
  DollarSign,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CompanyPanelHeader from '@/components/layout/CompanyPanelHeader';
import { useToast } from '@/context/ToastContext';

export default function ConfiguracoesEmpresaPage() {
  const { company, user, openEditCompanyModal } = useAuth();
  const { showToast } = useToast();

  const [emailNfe, setEmailNfe] = useState('fiscal@techsolutions.com.br');
  const [emailBoleto, setEmailBoleto] = useState('financeiro@techsolutions.com.br');
  const [notifyWhatsApp, setNotifyWhatsApp] = useState(true);
  const [notifyStockAlert, setNotifyStockAlert] = useState(true);
  const [notifyApprovals, setNotifyApprovals] = useState(true);
  const [approvalLimitDefault, setApprovalLimitDefault] = useState<number>(10000);
  const [autoApproveUnderLimit, setAutoApproveUnderLimit] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Configurações e preferências corporativas salvas com sucesso!', 'success');
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans">
      
      {/* 1. SHARED COMPANY PANEL HEADER */}
      <CompanyPanelHeader
        title="Configurações Corporativas & Preferências"
        subtitle="Notificações fiscais, regras de disparo de faturamento, segurança 2FA e parâmetros de alçada."
        activeBadge="Parâmetros Globais"
      />

      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 pt-8 space-y-8">
        
        <form onSubmit={handleSavePreferences} className="space-y-6">
          
          {/* Section 1: E-mails Fiscais & Cobrança */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#004e38] flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-gray-900">Roteamento de XMLs, DANFEs & Boletos</h2>
                <p className="text-xs text-gray-400">Contas de e-mail que receberão automaticamente os documentos de cada faturamento.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">E-mail para XMLs de NF-e & DANFE (Fiscal) *</label>
                <input
                  type="email"
                  required
                  value={emailNfe}
                  onChange={(e) => setEmailNfe(e.target.value)}
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 block">E-mail para Faturas, Boletos & Notificações de Cobrança *</label>
                <input
                  type="email"
                  required
                  value={emailBoleto}
                  onChange={(e) => setEmailBoleto(e.target.value)}
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Notificações & Alertas */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-gray-900">Alertas Operacionais & WhatsApp</h2>
                <p className="text-xs text-gray-400">Escolha quais canais de notificação a equipe deseja receber.</p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-center justify-between p-3.5 bg-[#f8fafc] rounded-2xl border border-gray-200 cursor-pointer hover:border-[#004e38] transition-colors">
                <div>
                  <span className="font-extrabold text-gray-900 block">Notificações por WhatsApp Business</span>
                  <span className="text-gray-400 text-[11px]">Receber código de rastreio e 2ª via do boleto pelo WhatsApp.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyWhatsApp}
                  onChange={(e) => setNotifyWhatsApp(e.target.checked)}
                  className="w-5 h-5 accent-[#004e38]"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-[#f8fafc] rounded-2xl border border-gray-200 cursor-pointer hover:border-[#004e38] transition-colors">
                <div>
                  <span className="font-extrabold text-gray-900 block">Alerta de Reposição de Estoque</span>
                  <span className="text-gray-400 text-[11px]">Avisar quando itens estratégicos atingirem o estoque de segurança.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyStockAlert}
                  onChange={(e) => setNotifyStockAlert(e.target.checked)}
                  className="w-5 h-5 accent-[#004e38]"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 bg-[#f8fafc] rounded-2xl border border-gray-200 cursor-pointer hover:border-[#004e38] transition-colors">
                <div>
                  <span className="font-extrabold text-gray-900 block">Alerta de Pedidos Aguardando Aprovação</span>
                  <span className="text-gray-400 text-[11px]">Notificar aprovadores assim que um comprador submeter um pedido acima da alçada.</span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyApprovals}
                  onChange={(e) => setNotifyApprovals(e.target.checked)}
                  className="w-5 h-5 accent-[#004e38]"
                />
              </label>
            </div>
          </div>

          {/* Section 3: Segurança & Autenticação */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-2xs space-y-5">
            <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-900 flex items-center justify-center font-bold">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-gray-900">Segurança & Autenticação de Dois Fatores (2FA)</h2>
                <p className="text-xs text-gray-400">Proteção de acesso para operações de faturamento e limites de crédito.</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-2xl border border-gray-200 text-xs">
              <div className="space-y-0.5">
                <span className="font-extrabold text-gray-900 block">Autenticação 2FA Obrigatória para Aprovação de Pedidos</span>
                <span className="text-gray-400 text-[11px]">Exige código temporário do Google Authenticator para fechar pedidos acima de R$ 50.000,00.</span>
              </div>
              <input
                type="checkbox"
                checked={twoFactorAuth}
                onChange={(e) => setTwoFactorAuth(e.target.checked)}
                className="w-5 h-5 accent-[#004e38]"
              />
            </div>
          </div>

          {/* Submit Button Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              className="bg-[#004e38] hover:bg-[#033627] text-white font-black text-xs px-8 py-3 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm hover:scale-102"
            >
              <Save className="w-4 h-4 text-amber-300" />
              <span>Salvar Todas as Preferências</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
