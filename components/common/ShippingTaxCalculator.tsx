'use client';

import React, { useState } from 'react';
import { Truck, ShieldCheck, Scale, FileText } from 'lucide-react';

interface ShippingTaxCalculatorProps {
  productPrice?: number;
}

export default function ShippingTaxCalculator({ productPrice = 2549.00 }: ShippingTaxCalculatorProps) {
  const [cep, setCep] = useState('');
  const [taxPurpose, setTaxPurpose] = useState<'REVENDA' | 'USO_CONSUMO'>('REVENDA');
  const [calculated, setCalculated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cep.trim() || cep.length < 8) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCalculated(true);
    }, 400);
  };

  const icmsCredit = productPrice * 0.12;
  const icmsStAmount = taxPurpose === 'REVENDA' ? productPrice * 0.08 : 0;
  const difalAmount = taxPurpose === 'USO_CONSUMO' ? productPrice * 0.06 : 0;

  return (
    <div className="bg-[#f5f6f6] p-5 rounded-3xl border border-gray-200 space-y-4 text-xs font-sans">
      <div className="flex items-center gap-2">
        <Truck className="w-5 h-5 text-[#2563eb]" />
        <div>
          <h4 className="font-extrabold text-gray-900 text-sm">Simulador de Frete & Tributação por CEP</h4>
          <p className="text-[11px] text-gray-500">Apuração de ICMS-ST, DIFAL e prazos de entrega dos Centros de Distribuição</p>
        </div>
      </div>

      {/* Tax Purpose Toggle */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
          Finalidade da Compra (Regime Fiscal)
        </label>
        <div className="grid grid-cols-2 gap-2 bg-gray-200/70 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setTaxPurpose('REVENDA')}
            className={`py-2 px-3 rounded-xl font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              taxPurpose === 'REVENDA'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Revenda Comercial (ICMS-ST)</span>
          </button>

          <button
            type="button"
            onClick={() => setTaxPurpose('USO_CONSUMO')}
            className={`py-2 px-3 rounded-xl font-bold text-[11px] transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              taxPurpose === 'USO_CONSUMO'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Uso / Ativo Imobilizado (DIFAL)</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleCalculate} className="flex gap-2">
        <input
          type="text"
          value={cep}
          onChange={(e) => setCep(e.target.value)}
          placeholder="Digite seu CEP (ex: 01310-100)..."
          className="flex-1 bg-white border border-gray-200 rounded-full px-4 py-2.5 font-medium text-xs focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold px-5 py-2.5 rounded-full transition-all shrink-0 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Calculando...' : 'Calcular'}
        </button>
      </form>

      {/* Calculated Results */}
      {calculated && (
        <div className="space-y-3 pt-2 animate-in fade-in duration-200">
          
          <div className="bg-white p-3.5 rounded-2xl border border-gray-200 space-y-2">
            <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Opções de Frete Disponíveis</span>
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-[#2563eb] font-black text-[9px] px-2 py-0.5 rounded">CIF Express</span>
                <div>
                  <p className="font-bold text-gray-900">OneSync Logística Própria (CD SP)</p>
                  <p className="text-[10px] text-gray-400">Entrega em até 2 dias úteis</p>
                </div>
              </div>
              <span className="font-black text-[#2563eb] text-xs">FRETE GRÁTIS</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="bg-blue-100 text-blue-800 font-black text-[9px] px-2 py-0.5 rounded">FOB Rodoviário</span>
                <div>
                  <p className="font-bold text-gray-900">Jamef / Braspress Transportes</p>
                  <p className="text-[10px] text-gray-400">Entrega em até 3 dias úteis</p>
                </div>
              </div>
              <span className="font-bold text-gray-700 text-xs">R$ 38,90</span>
            </div>
          </div>

          {/* Tax Calculation Details */}
          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-blue-950 space-y-2">
            <div className="flex items-center justify-between font-bold text-xs border-b border-blue-200 pb-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2563eb]" />
                <span>Memória de Cálculo Tributário B2B</span>
              </div>
              <span className="bg-[#2563eb] text-white text-[9px] font-mono px-2 py-0.5 rounded uppercase">
                {taxPurpose === 'REVENDA' ? 'Substituição Tributária' : 'DIFAL Automático'}
              </span>
            </div>

            {taxPurpose === 'REVENDA' ? (
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-600">ICMS Próprio Destacado (12%):</span>
                  <strong className="text-blue-900">R$ {icmsCredit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} (Crédito Fiscal)</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ICMS-ST Retido na Fonte (MVA 40%):</span>
                  <strong className="text-blue-900">R$ {icmsStAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </div>
                <p className="text-[10px] text-blue-800 pt-1">
                  Sua empresa tem direito a crédito de PIS/COFINS (9.25%) e ICMS destacado conforme regime tributário do CNPJ.
                </p>
              </div>
            ) : (
              <div className="space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-gray-600">Alíquota Interestadual (CD Origem):</span>
                  <strong className="text-blue-900">12,00%</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">DIFAL Interestadual Estimado (6%):</span>
                  <strong className="text-blue-900">R$ {difalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                </div>
                <p className="text-[10px] text-blue-800 pt-1">
                  Compra para Ativo Imobilizado/Consumo com DIFAL recolhido na emissão da NF-e (sem bitributação na barreira fiscal).
                </p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
