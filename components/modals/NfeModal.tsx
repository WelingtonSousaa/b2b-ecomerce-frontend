'use client';

import React from 'react';
import { X, FileCode, Download, CheckCircle2, Building2 } from 'lucide-react';

interface NfeModalProps {
  isOpen: boolean;
  onClose: () => void;
  nfeNumber?: string;
  series?: string;
  issueDate?: string;
  totalValue?: number;
  nfeKey?: string;
}

export default function NfeModal({
  isOpen,
  onClose,
  nfeNumber = '000.148.920',
  series = '1',
  issueDate = '28/07/2026',
  totalValue = 32490.00,
  nfeKey = '35260712345678000190550010001489201984500012'
}: NfeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-200 w-full max-w-2xl overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-[#0b1d16] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-black flex items-center justify-center text-xs shadow-sm">
              NFe
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">DANFE & Central de Documentos Fiscais</h3>
              <p className="text-[10px] text-emerald-300">Emissão Autorizada pela SEFAZ • Chave Eletrônica de Acesso</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-emerald-900/60 rounded-lg text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* SEFAZ Status Badge */}
          <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-extrabold text-emerald-950 block">Uso Autorizado pela SEFAZ SP</span>
                <span className="text-[10px] text-emerald-800 font-mono">Protocolo de Autorização: 135260098412948</span>
              </div>
            </div>
            <span className="bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wide">
              AUTORIZADA
            </span>
          </div>

          {/* Access Key Display */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1.5">
            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Chave de Acesso da NF-e (44 dígitos)
            </label>
            <p className="font-mono text-xs font-bold text-gray-900 tracking-wider bg-white p-2.5 rounded-xl border border-gray-300 select-all">
              {nfeKey}
            </p>
          </div>

          {/* NFe Summary Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <span className="text-[10px] font-semibold text-gray-400 block">Número da NF-e</span>
              <span className="font-extrabold text-gray-900 text-xs">{nfeNumber}</span>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <span className="text-[10px] font-semibold text-gray-400 block">Série</span>
              <span className="font-extrabold text-gray-900 text-xs">{series}</span>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <span className="text-[10px] font-semibold text-gray-400 block">Data de Emissão</span>
              <span className="font-extrabold text-gray-900 text-xs">{issueDate}</span>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
              <span className="text-[10px] font-semibold text-gray-400 block">Valor Total Nota</span>
              <span className="font-black text-emerald-900 text-xs">
                R$ {totalValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Fiscal Tax Breakdown */}
          <div className="bg-gray-50/80 p-4 rounded-2xl border border-gray-200 text-gray-700 space-y-1.5">
            <h4 className="font-extrabold text-gray-900 text-xs flex items-center gap-1.5 border-b border-gray-200 pb-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              Destinatário: Tech Solutions LTDA (CNPJ: 12.345.678/0001-90)
            </h4>
            <div className="grid grid-cols-3 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-gray-400 block">Base ICMS:</span>
                <span className="font-bold text-gray-900">R$ 32.490,00</span>
              </div>
              <div>
                <span className="text-gray-400 block">Valor ICMS (18%):</span>
                <span className="font-bold text-gray-900">R$ 5.848,20</span>
              </div>
              <div>
                <span className="text-gray-400 block">ICMS-ST Retido:</span>
                <span className="font-bold text-emerald-900">R$ 1.280,00</span>
              </div>
            </div>
          </div>

          {/* Download Buttons */}
          <div className="pt-3 flex items-center justify-between border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
            >
              Fechar
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Download do arquivo XML da NFe iniciado.')}
                className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-900 font-extrabold flex items-center gap-2 transition-colors border border-gray-300"
              >
                <FileCode className="w-4 h-4 text-amber-600" />
                <span>Baixar XML</span>
              </button>

              <button
                onClick={() => alert('Download da DANFE em PDF iniciado.')}
                className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold flex items-center gap-2 transition-colors shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Baixar DANFE (PDF)</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
