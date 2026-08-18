'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  FileSpreadsheet,
  Building2,
  TrendingUp,
  Percent,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Download
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CompanyPanelHeader from '@/components/layout/CompanyPanelHeader';
import { useToast } from '@/context/ToastContext';

export default function AnaliseTributariaPage() {
  const { company } = useAuth();
  const { showToast } = useToast();

  const currentCompany = company || {
    regimeTributario: 'LUCRO_REAL',
    razaoSocial: 'Tech Solutions & Tecnologia LTDA',
    cnpj: '12.345.678/0001-95'
  };

  const [simulatedUF, setSimulatedUF] = useState('SP');
  const [orderValue, setOrderValue] = useState(25000);
  const [purchasePurpose, setPurchasePurpose] = useState<'RESELL' | 'CONSUMPTION'>('RESELL');
  const [mvaPercentage, setMvaPercentage] = useState(40);
  const [hasSuframaOption, setHasSuframaOption] = useState(false);

  // Dynamic tax calculation based on destination UF, regime, and purpose
  const calculateTaxes = (val: number, uf: string, purpose: 'RESELL' | 'CONSUMPTION', mva: number, suframa: boolean) => {
    let icmsRate = 0.18;
    let difalRate = 0.00;
    let suframaDiscount = 0.00;

    if (uf === 'AM' || suframa) {
      suframaDiscount = val * 0.12; // ZFM tax incentive (IPI + PIS/COFINS exemption)
      icmsRate = 0.00;
    } else if (['MG', 'RJ', 'PR', 'RS', 'SC'].includes(uf)) {
      icmsRate = 0.12; // Inter-state
      difalRate = purpose === 'CONSUMPTION' ? val * 0.06 : 0;
    } else if (['BA', 'PE', 'CE', 'GO', 'DF'].includes(uf)) {
      icmsRate = 0.07;
      difalRate = purpose === 'CONSUMPTION' ? val * 0.11 : 0;
    }

    const icmsProprio = val * icmsRate;
    
    // ICMS-ST applies only for RESELL
    let icmsStAmount = 0;
    if (purpose === 'RESELL' && uf !== 'AM' && !suframa) {
      const baseCalculoSt = val * (1 + mva / 100);
      const icmsDebitoSt = baseCalculoSt * (uf === 'SP' ? 0.18 : 0.18);
      icmsStAmount = Math.max(0, icmsDebitoSt - icmsProprio);
    }

    const ipiRate = 0.05;
    const ipi = (uf === 'AM' || suframa) ? 0 : val * ipiRate;
    
    const pisCofinsRate = currentCompany.regimeTributario === 'LUCRO_REAL' ? 0.0925 : 0.0365;
    const pisCofins = (uf === 'AM' || suframa) ? 0 : val * pisCofinsRate;

    const totalTaxes = icmsProprio + difalRate + icmsStAmount + ipi + pisCofins - suframaDiscount;

    // Fiscal Credit (Only for Lucro Real or Presumido for Resell)
    const netCredit = (currentCompany.regimeTributario === 'LUCRO_REAL' && purpose === 'RESELL')
      ? (icmsProprio + pisCofins)
      : 0;

    return {
      icmsProprio,
      icmsSt: icmsStAmount,
      difal: difalRate,
      ipi,
      pisCofins,
      suframaDiscount,
      totalTaxes: Math.max(0, totalTaxes),
      netCredit
    };
  };

  const currentCalc = calculateTaxes(orderValue, simulatedUF, purchasePurpose, mvaPercentage, hasSuframaOption);

  const handleExportFiscalReport = () => {
    const content = `================================================================================
RELATÓRIO DE APURAÇÃO FISCAL, TRIBUTÁRIA E CRÉDITOS B2B
================================================================================
Empresa: ${currentCompany.razaoSocial}
CNPJ: ${currentCompany.cnpj}
Regime Tributário: ${currentCompany.regimeTributario}
Finalidade da Compra: ${purchasePurpose === 'RESELL' ? 'Para Revenda Comercial (ICMS-ST + Crédito)' : 'Uso / Consumo ou Ativo (DIFAL)'}
UF de Destino: ${simulatedUF}
Data de Emissão: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}
================================================================================

BASE DE CÁLCULO:
- Valor dos Produtos / Lote: R$ ${orderValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- MVA (Margem de Valor Agregado ST): ${mvaPercentage}%
- Incentivo SUFRAMA / ZFM: ${hasSuframaOption ? 'SIM (Isenção IPI e PIS/COFINS)' : 'NÃO'}

DISCRIMINAÇÃO DOS TRIBUTOS (NF-e):
- ICMS Próprio da Operação: R$ ${currentCalc.icmsProprio.toFixed(2)}
- ICMS-ST (Substituição Tributária): R$ ${currentCalc.icmsSt.toFixed(2)}
- DIFAL (Diferencial de Alíquota): R$ ${currentCalc.difal.toFixed(2)}
- IPI (Produtos Industrializados): R$ ${currentCalc.ipi.toFixed(2)}
- PIS / COFINS Retidos: R$ ${currentCalc.pisCofins.toFixed(2)}
- Desconto Incentivo SUFRAMA: R$ ${currentCalc.suframaDiscount.toFixed(2)}
--------------------------------------------------------------------------------
TOTAL DE TRIBUTOS APURADOS: R$ ${currentCalc.totalTaxes.toFixed(2)}
CRÉDITO FISCAL APROPRIÁVEL (ICMS + PIS/COFINS): R$ ${currentCalc.netCredit.toFixed(2)}
================================================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `demonstrativo_fiscal_${currentCompany.cnpj.replace(/\D/g, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Demonstrativo Fiscal (DRE) baixado com sucesso!', 'success');
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans">
      
      {/* 1. SHARED COMPANY PANEL HEADER */}
      <CompanyPanelHeader
        title="Relatório Tributário & Apuração Fiscal B2B"
        subtitle="Simulação de ICMS-ST com MVA, DIFAL Interestadual, IPI, PIS/COFINS e créditos fiscais recuperáveis por CNPJ."
        activeBadge={`Regime: ${currentCompany.regimeTributario}`}
        actions={
          <button
            onClick={handleExportFiscalReport}
            className="bg-[#004e38] hover:bg-[#033627] text-white text-xs font-black px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-amber-300" />
            <span>Baixar Demonstrativo Fiscal (DRE)</span>
          </button>
        }
      />

      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 pt-8 space-y-8">

        {/* Tax Summary Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Regime Tributário</span>
            <p className="text-xl font-black text-gray-900">{currentCompany.regimeTributario}</p>
            <span className="text-[10px] text-emerald-700 font-bold">Validação na Receita Federal OK</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">ICMS-ST Acumulado</span>
            <p className="text-xl font-black text-[#004e38]">
              R$ {currentCalc.icmsSt.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-gray-500">Recolhimento na Fonte por GNRE</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">DIFAL Interestadual</span>
            <p className="text-xl font-black text-blue-900">
              R$ {currentCalc.difal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-gray-500">EC 87/2015 Partilha por UF</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-1 shadow-2xs">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Crédito Fiscal Apropriável</span>
            <p className="text-xl font-black text-emerald-700">
              R$ {currentCalc.netCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-emerald-700 font-bold">PIS/COFINS & ICMS Entrada</span>
          </div>
        </div>

        {/* Simulador Interativo de Impostos */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 space-y-6 shadow-2xs">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-gray-100 pb-5 gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#004e38] flex items-center justify-center font-bold shadow-xs">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Simulador de Tributação por UF & Destinação da Mercadoria</h2>
                <p className="text-xs text-gray-500">Simule a tributação para revenda (com ICMS-ST) ou consumo próprio (com DIFAL).</p>
              </div>
            </div>

            {/* Purpose Toggle */}
            <div className="flex bg-[#f5f6f6] p-1 rounded-2xl text-xs font-bold shrink-0">
              <button
                type="button"
                onClick={() => setPurchasePurpose('RESELL')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  purchasePurpose === 'RESELL'
                    ? 'bg-[#004e38] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🔄 Para Revenda Comercial
              </button>
              <button
                type="button"
                onClick={() => setPurchasePurpose('CONSUMPTION')}
                className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  purchasePurpose === 'CONSUMPTION'
                    ? 'bg-[#004e38] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🏢 Uso / Consumo ou Ativo
              </button>
            </div>
          </div>

          {/* Simulator Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-medium">
            <div>
              <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">UF de Destino / Entrega:</label>
              <select
                value={simulatedUF}
                onChange={(e) => setSimulatedUF(e.target.value)}
                className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-3.5 py-2.5 font-bold text-gray-900 focus:outline-none cursor-pointer"
              >
                {['SP', 'MG', 'RJ', 'PR', 'RS', 'SC', 'BA', 'PE', 'CE', 'GO', 'DF', 'AM'].map(u => (
                  <option key={u} value={u}>
                    {u} {u === 'SP' ? '(Interno 18%)' : u === 'AM' ? '(SUFRAMA Isento)' : '(Interestadual)'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">Valor Base do Lote (R$):</label>
              <input
                type="number"
                step="500"
                value={orderValue}
                onChange={(e) => setOrderValue(Number(e.target.value))}
                className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-3.5 py-2.5 font-mono font-bold text-gray-900 focus:outline-none"
              />
            </div>

            {purchasePurpose === 'RESELL' && (
              <div>
                <label className="text-[10px] font-bold text-gray-500 block uppercase mb-1">
                  MVA Ajustada ICMS-ST ({mvaPercentage}%):
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={mvaPercentage}
                  onChange={(e) => setMvaPercentage(Number(e.target.value))}
                  className="w-full accent-[#004e38] mt-2 cursor-pointer"
                />
              </div>
            )}

            <div className="flex items-center gap-2 pt-4">
              <label className="flex items-center gap-2 cursor-pointer bg-gray-50 p-2.5 rounded-xl border border-gray-200 w-full">
                <input
                  type="checkbox"
                  checked={hasSuframaOption}
                  onChange={(e) => setHasSuframaOption(e.target.checked)}
                  className="accent-[#004e38] w-4 h-4"
                />
                <span className="text-xs font-bold text-gray-800">Incentivo SUFRAMA / ZFM</span>
              </label>
            </div>
          </div>

          {/* Tax Breakdown Table */}
          <div className="space-y-3 text-xs font-medium border-t border-gray-100 pt-4">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">
                ICMS Próprio da Operação ({simulatedUF === 'SP' ? '18% Interno SP' : simulatedUF === 'AM' ? 'Isento SUFRAMA' : '12% / 7% Inter'})
              </span>
              <strong className="text-gray-900 font-mono">R$ {currentCalc.icmsProprio.toFixed(2)}</strong>
            </div>

            {purchasePurpose === 'RESELL' && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">
                  ICMS Substituição Tributária (ICMS-ST Destino com MVA {mvaPercentage}%)
                </span>
                <strong className="text-emerald-800 font-mono font-bold">R$ {currentCalc.icmsSt.toFixed(2)}</strong>
              </div>
            )}

            {purchasePurpose === 'CONSUMPTION' && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">DIFAL Interestadual (Diferencial de Alíquota)</span>
                <strong className="text-blue-900 font-mono font-bold">R$ {currentCalc.difal.toFixed(2)}</strong>
              </div>
            )}

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">IPI (Imposto sobre Produtos Industrializados 5%)</span>
              <strong className="text-gray-900 font-mono">R$ {currentCalc.ipi.toFixed(2)}</strong>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">
                PIS / COFINS ({currentCompany.regimeTributario === 'LUCRO_REAL' ? '9,25% Não-Cumulativo' : '3,65% Cumulativo'})
              </span>
              <strong className="text-gray-900 font-mono">R$ {currentCalc.pisCofins.toFixed(2)}</strong>
            </div>

            {currentCalc.suframaDiscount > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-100 text-emerald-700 font-bold">
                <span>Incentivo Zona Franca de Manaus (SUFRAMA):</span>
                <span className="font-mono">- R$ {currentCalc.suframaDiscount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between border-t border-gray-200 pt-3 text-sm font-black">
              <span>Total de Tributos Calculados no Faturamento:</span>
              <span className="text-[#004e38] font-mono text-base">
                R$ {currentCalc.totalTaxes.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {currentCalc.netCredit > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between text-xs text-[#004e38]">
                <span className="font-bold">✨ Aproveitamento de Crédito Tributário (Lucro Real):</span>
                <span className="font-mono font-black text-sm">
                  + R$ {currentCalc.netCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
