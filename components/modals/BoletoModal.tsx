'use client';

import React, { useState } from 'react';
import { X, Printer, Copy, Check, AlertTriangle, Download } from 'lucide-react';

interface BoletoModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceNumber?: string;
  originalAmount?: number;
  dueDate?: string;
}

export default function BoletoModal({
  isOpen,
  onClose,
  invoiceNumber = 'FAT-2026-0421',
  originalAmount = 14500.00,
  dueDate = '05/08/2026'
}: BoletoModalProps) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  if (!isOpen) return null;

  // Calculate overdue interest (mock 2% penalty + 0.033% per day)
  const isOverdue = true;
  const penalty = originalAmount * 0.02; // R$ 290.00
  const dailyInterest = originalAmount * 0.00033 * 7; // 7 dias de atraso = R$ 33.49
  const updatedAmount = originalAmount + penalty + dailyInterest;

  const barcode = '34191.09008 61234.567890 12345.678904 1 98450001482349';
  const pixCopyPaste = '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-426614174000520400005303986540714823.495802BR5925SHOPCART ATACADO E DISTR6009SAO PAULO62070503***6304E2D5';

  const copyToClipboard = (text: string, type: 'code' | 'pix') => {
    navigator.clipboard.writeText(text);
    if (type === 'code') {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedPix(true);
      setTimeout(() => setCopiedPix(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-200 w-full max-w-xl overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-[#0b1d16] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-gray-950 font-black flex items-center justify-center text-xs">
              2ª VIA
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">2ª Via de Boleto Faturado B2B</h3>
              <p className="text-[10px] text-emerald-300">Recálculo de Juros e Multas em Tempo Real</p>
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
          
          {/* Overdue Warning Banner */}
          {isOverdue && (
            <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200 flex items-start gap-3 text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-extrabold text-amber-950 block">Boleto Vencido - Atualização Automática Bancária</span>
                <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                  Vencimento original em <strong className="text-amber-950">{dueDate}</strong>. Foram aplicados 2% de multa contratual (R$ {penalty.toFixed(2)}) e juros de mora diários.
                </p>
              </div>
            </div>
          )}

          {/* Financial Breakdown Card */}
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
            <div className="flex items-center justify-between text-gray-600 border-b border-gray-200/80 pb-2">
              <span>Fatura Faturada:</span>
              <span className="font-mono font-bold text-gray-900">{invoiceNumber}</span>
            </div>
            <div className="flex items-center justify-between text-gray-600">
              <span>Valor Principal da Compra:</span>
              <span className="font-semibold text-gray-900">R$ {originalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between text-amber-700">
              <span>Multa Por Atraso (2%):</span>
              <span className="font-semibold">+ R$ {penalty.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between text-amber-700">
              <span>Juros de Mora (0,033%/dia):</span>
              <span className="font-semibold">+ R$ {dailyInterest.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-300 font-black text-sm">
              <span className="text-emerald-950">Novo Valor para Quitação Hoje:</span>
              <span className="text-emerald-900 text-base">R$ {updatedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Barcode Field */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-700">
              Linha Digitável do Boleto Recalculado
            </label>
            <div className="flex items-center gap-2 bg-gray-100 p-2.5 rounded-xl border border-gray-300 font-mono text-[11px] text-gray-800">
              <span className="truncate flex-1 select-all font-bold">{barcode}</span>
              <button
                onClick={() => copyToClipboard(barcode, 'code')}
                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-sans font-bold text-[11px] flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* PIX Copy Paste Alternative */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-gray-700">
              Ou pague com PIX para Baixa Instantânea
            </label>
            <div className="flex items-center gap-2 bg-emerald-50/80 p-2.5 rounded-xl border border-emerald-200 font-mono text-[11px] text-emerald-950">
              <span className="truncate flex-1 select-all font-medium">{pixCopyPaste}</span>
              <button
                onClick={() => copyToClipboard(pixCopyPaste, 'pix')}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-gray-950 rounded-lg font-sans font-black text-[11px] flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copiedPix ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPix ? 'Copiado!' : 'Copiar PIX'}</span>
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 flex items-center justify-between border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
            >
              Fechar
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Download do PDF do Boleto iniciado.')}
                className="px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white font-extrabold flex items-center gap-2 transition-colors shadow-md"
              >
                <Download className="w-4 h-4" />
                <span>Baixar PDF</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold flex items-center gap-2 transition-colors shadow-md"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimir</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
