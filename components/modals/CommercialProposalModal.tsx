'use client';

import React from 'react';
import {
  FileText,
  Printer,
  X,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ItemProposal {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sku?: string;
}

interface CommercialProposalModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: ItemProposal[];
  subtotal: number;
}

export default function CommercialProposalModal({
  isOpen,
  onClose,
  items,
  subtotal
}: CommercialProposalModalProps) {
  const { company } = useAuth();
  const currentCompany = company || {
    id: 'comp-default',
    cnpj: '00.000.000/0001-00',
    razaoSocial: 'Empresa Compradora B2B',
    nomeFantasia: 'Empresa B2B',
    inscricaoEstadual: 'ISENTO',
    regimeTributario: 'LUCRO_REAL' as const,
    status: 'ACTIVE' as const,
    hasSuframaIncentive: false,
    creditLimitTotal: 100000,
    creditLimitAvailable: 85000,
    branches: [],
    mainAddress: {
      logradouro: 'Av. Corporativa',
      numero: '100',
      bairro: 'Centro',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01000-000',
      pais: 'Brasil',
    },
  };

  const proposalNumber = 'PROP-2026-8842';
  const issueDate = '13/08/2026';
  const expiryDate = '23/08/2026';

  const freightCost = 0.00; // CIF Grátis
  const estimatedTaxST = subtotal * 0.045; // 4.5% ICMS-ST estimado
  const grandTotal = subtotal + freightCost + estimatedTaxST;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link público da Proposta Comercial copiado para a área de transferência!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans print:p-0 print:bg-white print:static">
      
      {/* Container */}
      <div className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden print:shadow-none print:border-none print:max-w-none print:max-h-none print:rounded-none">
        
        {/* Header Bar (Hidden during print) */}
        <div className="bg-[#004e38] text-white p-5 flex items-center justify-between shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-extrabold tracking-tight">Proposta Comercial B2B (Orçamento Oficial)</h3>
              <p className="text-[11px] text-emerald-100">Documento pronto para homologação e departamento financeiro</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar Link</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-gray-900 text-xs font-black px-4 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / Salvar PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Proposal Body */}
        <div className="p-8 overflow-y-auto space-y-8 flex-1 print:p-8">
          
          {/* Company Branding & Proposal Info Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-gray-900 pb-6 gap-4">
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[#004e38] text-white flex items-center justify-center font-black">
                  S
                </div>
                <span className="text-2xl font-black text-gray-900 tracking-tight">Shopcart Brasil Ltda.</span>
              </div>
              <p className="text-xs text-gray-600 font-medium">CNPJ: 12.345.678/0001-99 | Inscrição Estadual: 109.876.543.110</p>
              <p className="text-xs text-gray-500">Av. Paulista, 1000 - Bela Vista - São Paulo / SP - CEP: 01310-100</p>
            </div>

            <div className="bg-[#f5f6f6] p-4 rounded-2xl border border-gray-200 text-right space-y-1 shrink-0 print:border-gray-300">
              <span className="text-[10px] font-black text-[#004e38] uppercase tracking-wider block">Proposta Comercial Nº</span>
              <span className="font-mono text-lg font-black text-gray-900 block">{proposalNumber}</span>
              <div className="text-[11px] text-gray-600 font-semibold space-y-0.5 pt-1 border-t border-gray-200">
                <p>Emissão: <strong>{issueDate}</strong></p>
                <p>Validade: <strong className="text-red-700">{expiryDate}</strong> (10 dias)</p>
              </div>
            </div>

          </div>

          {/* Customer / Buyer Information Box */}
          <div className="bg-[#f5f6f6] p-6 rounded-2xl border border-gray-200 space-y-3 text-xs print:border-gray-300">
            <h4 className="font-black text-gray-900 uppercase tracking-wider text-[11px] border-b border-gray-200 pb-2">
              Dados da Empresa Compradora (Cliente CNPJ)
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-gray-400 font-bold block">Razão Social / Cliente:</span>
                <span className="font-extrabold text-gray-900 text-sm">{currentCompany.razaoSocial}</span>
              </div>

              <div>
                <span className="text-gray-400 font-bold block">CNPJ da Empresa:</span>
                <span className="font-mono font-black text-gray-900">{currentCompany.cnpj}</span>
              </div>

              <div>
                <span className="text-gray-400 font-bold block">Inscrição Estadual:</span>
                <span className="font-mono font-bold text-gray-900">{currentCompany.inscricaoEstadual}</span>
              </div>

              <div>
                <span className="text-gray-400 font-bold block">Regime Tributário:</span>
                <span className="font-bold text-gray-900">{currentCompany.regimeTributario}</span>
              </div>

              <div className="sm:col-span-2">
                <span className="text-gray-400 font-bold block">Endereço Fiscal de Faturamento:</span>
                <span className="font-semibold text-gray-800">
                  {currentCompany.mainAddress.logradouro}, {currentCompany.mainAddress.numero} - {currentCompany.mainAddress.bairro}, {currentCompany.mainAddress.cidade}/{currentCompany.mainAddress.uf} (CEP: {currentCompany.mainAddress.cep})
                </span>
              </div>
            </div>
          </div>

          {/* Products & Items Table */}
          <div className="space-y-3">
            <h4 className="font-black text-gray-900 uppercase tracking-wider text-xs">
              Itens da Proposta & Escala de Preços por Volume
            </h4>

            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#004e38] text-white font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-3">SKU</th>
                    <th className="p-3">Descrição do Produto / Lote</th>
                    <th className="p-3 text-center">Qtd. (Unidades)</th>
                    <th className="p-3 text-right">Preço Unitário (R$)</th>
                    <th className="p-3 text-right">Subtotal (R$)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-medium">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="p-3 font-mono font-bold text-gray-500">{item.sku || `#8300${idx + 1}`}</td>
                      <td className="p-3 font-extrabold text-gray-900">{item.name}</td>
                      <td className="p-3 text-center font-bold">{item.quantity}</td>
                      <td className="p-3 text-right">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                      <td className="p-3 text-right font-black text-[#004e38]">
                        R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial & Tax Totals Calculation Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-2">
            
            {/* Payment & Conditions Terms */}
            <div className="bg-[#f5f6f6] p-5 rounded-2xl border border-gray-200 space-y-2 text-xs print:border-gray-300">
              <h5 className="font-extrabold text-gray-900 uppercase tracking-wider text-[11px]">
                Condições de Pagamento & Envio Aprovadas
              </h5>
              <ul className="space-y-1.5 text-gray-700 font-medium">
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#004e38]" />
                  <span><strong>Boleto Bancário Faturado:</strong> 28 / 56 / 84 dias (Sujeito à alçada)</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#004e38]" />
                  <span><strong>PIX CNPJ:</strong> Com 3% de desconto financeiro automático</span>
                </li>
                <li className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#004e38]" />
                  <span><strong>Frete Modalidade CIF:</strong> Expedição expressa do CD São Paulo</span>
                </li>
              </ul>
            </div>

            {/* Totals Summary */}
            <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-2 text-xs font-semibold print:border-gray-300">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal dos Produtos:</span>
                <span className="font-bold text-gray-900">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Frete CIF (Expedição Expressa CD SP):</span>
                <span className="font-bold text-emerald-700">GRÁTIS</span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Estimativa de ICMS-ST / DIFAL Retido:</span>
                <span className="font-bold text-gray-900">R$ {estimatedTaxST.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                <span className="text-sm font-black text-gray-900">Valor Total da Proposta:</span>
                <span className="text-xl font-black text-[#004e38]">
                  R$ {grandTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

          </div>

          {/* Signature / Authorization Line */}
          <div className="pt-8 border-t border-gray-200 grid grid-cols-2 gap-8 text-center text-xs text-gray-500">
            <div className="space-y-1">
              <div className="border-b border-gray-400 w-48 mx-auto pb-8"></div>
              <p className="font-bold text-gray-900 pt-1">Shopcart Brasil Ltda.</p>
              <p className="text-[10px]">Departamento de Vendas Corporativas B2B</p>
            </div>

            <div className="space-y-1">
              <div className="border-b border-gray-400 w-48 mx-auto pb-8"></div>
              <p className="font-bold text-gray-900 pt-1">{currentCompany.razaoSocial}</p>
              <p className="text-[10px]">De acordo / Aceite do Comprador</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
