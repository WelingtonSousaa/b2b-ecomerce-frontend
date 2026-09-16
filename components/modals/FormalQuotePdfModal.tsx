'use client';

import React, { useState } from 'react';
import {
  X,
  Printer,
  Send,
  FileCheck2,
  Calendar,
  Download
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Product } from '@/types/b2b';

interface QuoteItem {
  product: Product;
  quantity: number;
}

interface FormalQuotePdfModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: QuoteItem[];
  customQuoteNumber?: string;
}

export default function FormalQuotePdfModal({
  isOpen,
  onClose,
  items,
  customQuoteNumber = 'RFQ-2026-8492',
}: FormalQuotePdfModalProps) {
  const { company, user } = useAuth();
  const { showToast } = useToast();
  const [isSent, setIsSent] = useState(false);
  const [directorEmail, setDirectorEmail] = useState('diretoria@empresa.com.br');

  const [dates] = useState(() => {
    const now = new Date();
    const until = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000);
    return {
      today: now.toLocaleDateString('pt-BR'),
      validUntil: until.toLocaleDateString('pt-BR')
    };
  });

  if (!isOpen) return null;

  const { today, validUntil } = dates;

  const subtotal = items.reduce((acc, it) => acc + it.product.basePrice * it.quantity, 0);
  const icmsEstimated = subtotal * 0.12;
  const ipiEstimated = subtotal * 0.05;
  const grandTotal = subtotal + ipiEstimated;

  const handlePrint = () => {
    window.print();
  };

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    showToast(`Proposta formal ${customQuoteNumber} enviada para ${directorEmail}!`, 'success');
    setTimeout(() => {
      setIsSent(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl overflow-hidden border border-gray-200 my-8 print:border-none print:shadow-none print:m-0 print:rounded-none">
        
        {/* MODAL ACTION BAR (Hidden in print) */}
        <div className="bg-[#2563eb] text-white p-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-blue-300" />
            <span className="font-bold text-sm">Gerador de Proposta Comercial & Cotação Formal B2B</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT BODY */}
        <div className="p-8 sm:p-12 space-y-8 text-gray-900 font-sans text-xs bg-white" id="printable-quote">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-[#2563eb] pb-6">
            <div>
              <div className="flex items-center gap-2 text-[#2563eb] font-black text-2xl tracking-tight">
                <span>OneSync</span>
                <span className="text-xs bg-[#2563eb] text-white px-2 py-0.5 rounded uppercase font-bold">B2B Distribuidora</span>
              </div>
              <p className="text-gray-500 text-[11px] mt-1">
                OneSync Comércio e Distribuição de Equipamentos LTDA<br />
                CNPJ: 45.928.190/0001-32 | IE: 112.490.119.110<br />
                Av. das Nações Unidas, 14200 - São Paulo/SP - CEP: 04794-000
              </p>
            </div>

            <div className="text-right space-y-1 sm:self-center">
              <span className="inline-block bg-blue-100 text-[#2563eb] font-mono font-black text-sm px-3 py-1 rounded-lg">
                PROPOSTA: {customQuoteNumber}
              </span>
              <div className="text-[11px] text-gray-500 flex items-center justify-end gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>Emissão: <strong>{today}</strong></span>
              </div>
              <div className="text-[11px] text-blue-800 font-bold">
                Validade: {validUntil} (15 dias)
              </div>
            </div>
          </div>

          {/* Client Details */}
          <div className="bg-gray-50 rounded-2xl p-5 border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Empresa Solicitante / Faturar Para</span>
              <strong className="text-sm font-bold text-gray-900 block mt-0.5">{company?.razaoSocial || 'TechSolutions Engenharia LTDA'}</strong>
              <span className="text-gray-600 block">CNPJ: {company?.cnpj || '12.345.678/0001-90'}</span>
              <span className="text-gray-600 block">Inscrição Estadual: {company?.inscricaoEstadual || 'ISENTO'}</span>
            </div>

            <div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Contato Responsável</span>
              <strong className="text-sm font-bold text-gray-900 block mt-0.5">{user?.name || 'Carlos Comprador'}</strong>
              <span className="text-gray-600 block">E-mail: {user?.email || 'compras@empresa.com.br'}</span>
              <span className="text-gray-600 block">Endereço de Entrega: São Paulo / SP (CD Central)</span>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <h3 className="font-extrabold text-sm text-gray-900 mb-3 uppercase tracking-wider">Itens e Equipamentos Cotados</h3>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-[10px] font-black text-gray-500 uppercase tracking-wider">
                  <th className="py-2.5">Item / SKU</th>
                  <th className="py-2.5">Descrição</th>
                  <th className="py-2.5">NCM</th>
                  <th className="py-2.5 text-center">Qtd</th>
                  <th className="py-2.5 text-right">Preço Unit. (R$)</th>
                  <th className="py-2.5 text-right">Total (R$)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-3 font-mono font-bold text-[#2563eb]">{it.product.sku}</td>
                    <td className="py-3 font-bold text-gray-800">{it.product.name}</td>
                    <td className="py-3 font-mono text-gray-500">{it.product.ncm}</td>
                    <td className="py-3 text-center font-bold">{it.quantity} un.</td>
                    <td className="py-3 text-right font-medium">R$ {it.product.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                    <td className="py-3 text-right font-black text-gray-900">
                      R$ {(it.product.basePrice * it.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary & Taxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
            <div className="space-y-2 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
              <span className="text-[10px] font-black text-[#2563eb] uppercase tracking-wider block">Condições Comerciais & Tributárias</span>
              <ul className="space-y-1 text-[11px] text-gray-700">
                <li>• <strong>Condição de Pagamento:</strong> Boleto Faturado a Prazo (30/60/90 dias)</li>
                <li>• <strong>Modalidade de Frete:</strong> CIF (Frete e Seguro Inclusos até o destino)</li>
                <li>• <strong>Garantia:</strong> 36 meses com atendimento On-Site e reposição expressa</li>
                <li>• <strong>Crédito de ICMS Estimado:</strong> 12% (R$ {icmsEstimated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</li>
              </ul>
            </div>

            <div className="space-y-2 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-right">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal dos Produtos:</span>
                <span className="font-bold">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>IPI Estimado (5%):</span>
                <span className="font-bold">R$ {ipiEstimated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Frete CIF Corporativo:</span>
                <span className="font-bold text-blue-700">GRÁTIS (ISENTO)</span>
              </div>
              <div className="flex justify-between text-base font-black text-[#2563eb] pt-2 border-t border-gray-200">
                <span>VALOR TOTAL FATURADO:</span>
                <span>R$ {grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Signatures & Formal Approval */}
          <div className="pt-8 border-t border-gray-300 grid grid-cols-2 gap-12 text-center text-[11px]">
            <div className="space-y-1">
              <div className="h-10 border-b border-gray-400" />
              <strong className="block text-gray-800">Departamento Comercial OneSync B2B</strong>
              <span className="text-gray-500">Vendas Corporativas & Licitações</span>
            </div>

            <div className="space-y-1">
              <div className="h-10 border-b border-gray-400" />
              <strong className="block text-gray-800">De Acordo / Diretoria do Comprador</strong>
              <span className="text-gray-500">Assinatura do Responsável com Carimbo CNPJ</span>
            </div>
          </div>

        </div>

        {/* FOOTER ACTIONS (Send by email / Cancel - hidden in print) */}
        <div className="bg-gray-50 p-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
          <form onSubmit={handleSendEmail} className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="email"
              value={directorEmail}
              onChange={(e) => setDirectorEmail(e.target.value)}
              placeholder="E-mail da diretoria..."
              className="bg-white border border-gray-300 rounded-full px-4 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              required
            />
            <button
              type="submit"
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSent ? 'Enviado!' : 'Enviar ao Diretor'}</span>
            </button>
          </form>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold px-5 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Proposta em PDF</span>
            </button>

            <button
              onClick={onClose}
              className="border border-gray-300 hover:bg-gray-100 text-gray-600 text-xs font-bold px-5 py-2 rounded-full transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
