'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, Copy, CheckCircle2, Clock, X, ArrowRight } from 'lucide-react';

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSuccess: () => void;
  amount: number;
}

export default function PixPaymentModal({
  isOpen,
  onClose,
  onConfirmSuccess,
  amount
}: PixPaymentModalProps) {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutos em segundos

  const pixDiscountAmount = amount * 0.95; // 5% de desconto no PIX
  const pixKey = '00020126580014BR.GOV.BCB.PIX0136shopcart-pix-cnpj-1234567800019952040000530398654052421.555802BR5925SHOPCART BRASIL LTDA6009SAO PAULO62070503***6304E2D8';

  // Timer countdown
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md overflow-hidden relative space-y-6 p-6 sm:p-8 text-center">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 rounded-full bg-[#f5f6f6] hover:bg-gray-200 text-gray-500 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="space-y-2 pt-2">
          <span className="inline-block bg-emerald-100 text-[#004e38] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
            PIX CNPJ Instantâneo (-5% Desconto)
          </span>
          <h3 className="text-xl font-black text-gray-900 tracking-tight">Pagamento via PIX CNPJ</h3>
          <p className="text-xs text-gray-500">
            Escaneie o QR Code ou copie a chave PIX para efetuar o pagamento.
          </p>
        </div>

        {/* Discount Amount Banner */}
        <div className="bg-[#f5f6f6] p-4 rounded-2xl border border-gray-200 space-y-1">
          <span className="text-[11px] text-gray-500 font-semibold block">Valor com Desconto de 5% Aplicado:</span>
          <div className="text-2xl font-black text-[#004e38]">
            R$ {pixDiscountAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </div>
          <span className="text-[10px] text-gray-400 font-medium">Economia de R$ {(amount - pixDiscountAmount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
        </div>

        {/* QR Code Container */}
        <div className="bg-white p-4 rounded-2xl border-2 border-emerald-500 inline-block mx-auto relative shadow-sm">
          <div className="w-44 h-44 bg-[#f8fafc] rounded-xl flex flex-col items-center justify-center relative p-2">
            <QrCode className="w-36 h-36 text-gray-900" />
            <div className="absolute w-8 h-8 rounded-lg bg-[#004e38] text-white font-black text-xs flex items-center justify-center border-2 border-white shadow-xs">
              S
            </div>
          </div>
        </div>

        {/* Timer Expiration */}
        <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 bg-amber-50 py-2 rounded-xl border border-amber-200">
          <Clock className="w-4 h-4 text-amber-600" />
          <span>Este QR Code expira em <strong className="text-amber-800 font-mono">{formatTime(timeLeft)}</strong></span>
        </div>

        {/* Copia e Cola Field */}
        <div className="space-y-2 text-left">
          <label className="text-[11px] font-bold text-gray-700 block">Chave PIX Copia e Cola:</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={pixKey}
              className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-3 py-2 text-[10px] font-mono text-gray-600 truncate focus:outline-none"
            />
            <button
              onClick={handleCopyPixKey}
              className="bg-[#004e38] hover:bg-[#033627] text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shrink-0 flex items-center gap-1 cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" /> Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" /> Copiar
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-time Status Indicator */}
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-600 pt-1">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
          <span>Aguardando confirmação bancária em tempo real...</span>
        </div>

        {/* Confirm Payment Action */}
        <button
          onClick={onConfirmSuccess}
          className="w-full bg-[#004e38] hover:bg-[#033627] text-white text-xs font-extrabold py-3.5 rounded-full transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Já Realizei o Pagamento via PIX</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
