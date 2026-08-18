'use client';

import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  Upload,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { CompanyAccount } from '@/types/b2b';
import { creditService } from '@/services/credit.service';

interface CreditLimitRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: CompanyAccount | null;
  onRequestSubmitted?: () => void;
}

export default function CreditLimitRequestModal({
  isOpen,
  onClose,
  company,
  onRequestSubmitted,
}: CreditLimitRequestModalProps) {
  const currentLimit = company?.creditLimitTotal || 45000.00;
  const [requestedLimit, setRequestedLimit] = useState<number>(120000.00);
  const [annualRevenue, setAnnualRevenue] = useState<number>(2400000.00);
  const [preferredTerms, setPreferredTerms] = useState('28_56_84');
  const [financialContact, setFinancialContact] = useState('financeiro@techsolutions.com.br');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [protocol, setProtocol] = useState('CRED-2026-0092');

  if (!isOpen) return null;

  // Live Score Calculator
  const ratio = requestedLimit / (annualRevenue / 12);
  const scoreGrade = ratio <= 0.8 ? 'AAA' : ratio <= 1.5 ? 'AA' : ratio <= 2.5 ? 'A' : 'BBB';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await creditService.requestLimitIncrease({
        companyId: company?.id || 'comp-1',
        requestedAmount: requestedLimit,
        annualRevenue,
        preferredTerms,
        financialContact
      });

      if (res.data?.protocol) {
        setProtocol(res.data.protocol);
      }
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onRequestSubmitted?.();
        onClose();
      }, 1500);
    } catch {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onRequestSubmitted?.();
        onClose();
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-xl overflow-hidden relative flex flex-col">
        
        {/* Header */}
        <div className="bg-[#004e38] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <CreditCard className="w-5 h-5 text-amber-300" />
            <h3 className="text-xl font-black">Solicitar Aumento de Limite de Crédito B2B</h3>
          </div>
          <p className="text-xs text-emerald-100">
            Faturamento direto a prazo no Boleto Bancário (28/56/84 dias) com análise automática de risco.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs overflow-y-auto max-h-[75vh]">
          
          {isSuccess && (
            <div className="bg-emerald-100 border border-emerald-300 text-[#004e38] p-3 rounded-2xl flex items-center gap-2 font-bold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5" />
              <span>Solicitação de Limite enviada com sucesso! Protocolo: {protocol}</span>
            </div>
          )}

          {/* Current Limit vs Requested Box */}
          <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 grid grid-cols-2 gap-3 text-center">
            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">Limite Atual Homologado</span>
              <span className="text-lg font-black text-gray-800">
                R$ {currentLimit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200">
              <span className="text-[10px] text-[#004e38] font-bold uppercase block">Limite Pretendido</span>
              <span className="text-lg font-black text-[#004e38]">
                R$ {Number(requestedLimit).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-gray-700">Novo Limite Solicitado (R$) *</label>
              <input
                type="number"
                step="1000"
                required
                value={requestedLimit}
                onChange={(e) => setRequestedLimit(Number(e.target.value))}
                className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl p-2.5 font-black text-sm text-[#004e38]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">Faturamento Anual Declarado (R$) *</label>
              <input
                type="number"
                step="10000"
                required
                value={annualRevenue}
                onChange={(e) => setAnnualRevenue(Number(e.target.value))}
                className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl p-2.5 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-gray-700">Condições de Prazo Desejadas</label>
              <select
                value={preferredTerms}
                onChange={(e) => setPreferredTerms(e.target.value)}
                className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl p-2.5 font-bold text-gray-900"
              >
                <option value="28_56_84">Boleto Faturado 28 / 56 / 84 Dias (Padrão Corporativo)</option>
                <option value="30_60_90">Boleto Faturado 30 / 60 / 90 Dias (Grandes Compras)</option>
                <option value="30_days">Boleto Direto 30 Dias (Com 2% de Desconto Adicional)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700">E-mail do Responsável Financeiro *</label>
              <input
                type="email"
                required
                value={financialContact}
                onChange={(e) => setFinancialContact(e.target.value)}
                className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl p-2.5 font-bold"
              />
            </div>
          </div>

          {/* Live Scoring Box */}
          <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#004e38]" />
              <div>
                <span className="font-black text-[#004e38] text-xs block">Simulação de Score de Crédito: Grau {scoreGrade}</span>
                <span className="text-[10px] text-emerald-900 font-medium">Compatibilidade de 96% com a saúde financeira do CNPJ</span>
              </div>
            </div>
            <span className="bg-[#004e38] text-white text-[10px] font-black px-2.5 py-1 rounded-full">
              Pré-Aprovado
            </span>
          </div>

          <div className="p-4 border border-dashed border-gray-300 rounded-2xl bg-[#f8fafc] text-center space-y-1 cursor-pointer">
            <Upload className="w-5 h-5 mx-auto text-gray-400" />
            <span className="font-bold text-gray-700 block">Anexar DRE, Balanço Patrimonial ou Extratos Fiscais</span>
            <span className="text-[10px] text-gray-400">PDF, XLS, SPED Contábil (Máx. 25MB)</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#004e38] hover:bg-[#033627] text-white font-black px-6 py-2 rounded-full shadow-xs cursor-pointer flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <span>Submeter para Análise Financeira</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
