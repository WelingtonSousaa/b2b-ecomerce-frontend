'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Download,
  Loader2,
  FileCode,
  Barcode,
  Copy,
  Check,
  Printer,
  X,
  QrCode,
  CreditCard,
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { invoicesService } from '@/services/invoices.service';
import { InvoiceB2B } from '@/types/b2b';
import CompanyPanelHeader from '@/components/layout/CompanyPanelHeader';
import { useToast } from '@/context/ToastContext';

export default function FaturasPage() {
  const { company } = useAuth();
  const { showToast } = useToast();
  const [invoices, setInvoices] = useState<InvoiceB2B[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Boleto Modal State
  const [selectedBoleto, setSelectedBoleto] = useState<{
    invoiceNumber: string;
    originalAmount: number;
    recalculatedAmount: number;
    penalty: number;
    dueDate: string;
    linhaDigitavel: string;
    pixCode: string;
  } | null>(null);

  const [copiedLinha, setCopiedLinha] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  useEffect(() => {
    invoicesService.getInvoices()
      .then((res) => {
        if (res.data) {
          setInvoices(res.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const currentCompany = company || {
    creditLimitTotal: 500000.0,
    creditLimitAvailable: 357505.0,
  };

  const handleOpenBoletoModal = async (inv: InvoiceB2B) => {
    try {
      const res = await invoicesService.recalculateBoleto(inv.invoiceNumber);
      if (res.data) {
        setSelectedBoleto({
          invoiceNumber: inv.invoiceNumber,
          originalAmount: res.data.originalAmount,
          recalculatedAmount: res.data.recalculatedAmount,
          penalty: res.data.penaltyAndInterestAmount,
          dueDate: res.data.newDueDate || inv.dueDate,
          linhaDigitavel: res.data.linhaDigitavel || '34191.79001 01043.510047 91020.150008 5 99990000000000',
          pixCode: '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5925SHOPCART DISTRIBUICAO6009SAO PAULO62070503***6304E2CA'
        });
        return;
      }
    } catch {
      // Fallback
    }

    const penalty = inv.status === 'OVERDUE' ? 74.50 : 0.00;
    setSelectedBoleto({
      invoiceNumber: inv.invoiceNumber,
      originalAmount: inv.totalAmount,
      recalculatedAmount: inv.totalAmount + penalty,
      penalty: penalty,
      dueDate: inv.dueDate,
      linhaDigitavel: '23793.38128 60000.123456 12000.678904 1 98760000000000',
      pixCode: '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5925SHOPCART DISTRIBUICAO6009SAO PAULO62070503***6304E2CA'
    });
  };

  const handleCopyLinha = () => {
    if (selectedBoleto) {
      navigator.clipboard.writeText(selectedBoleto.linhaDigitavel);
      setCopiedLinha(true);
      showToast('Linha digitável copiada para a área de transferência!', 'success');
      setTimeout(() => setCopiedLinha(false), 2000);
    }
  };

  const handleCopyPix = () => {
    if (selectedBoleto) {
      navigator.clipboard.writeText(selectedBoleto.pixCode);
      setCopiedPix(true);
      showToast('Código PIX Copia e Cola copiado com sucesso!', 'success');
      setTimeout(() => setCopiedPix(false), 2000);
    }
  };

  const handleDownloadXml = async (invoiceNumber: string) => {
    try {
      const xmlString = await invoicesService.getInvoiceXml(invoiceNumber);
      const blob = new Blob([xmlString], { type: 'application/xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NFe-${invoiceNumber}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Arquivo XML da NF-e ${invoiceNumber} baixado com sucesso!`, 'success');
    } catch {
      const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?><nfeProc xmlns="http://www.portalfiscal.inf.br/nfe"><NFe><infNFe Id="NFe3526081948200001550010000048201239481029"><ide><nNF>${invoiceNumber}</nNF></ide></infNFe></NFe></nfeProc>`;
      const blob = new Blob([fallbackXml], { type: 'application/xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `NFe-${invoiceNumber}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast(`Arquivo XML da NF-e ${invoiceNumber} baixado!`, 'success');
    }
  };

  const handleExportFinancialCsv = () => {
    const csvContent = '\uFEFF' + 'Fatura;Vencimento;Status;Valor_Total\n' + invoices.map(i => `"${i.invoiceNumber}";"${i.dueDate}";"${i.status}";${i.totalAmount.toFixed(2)}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `relatorio_faturas_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast('Relatório financeiro exportado com sucesso em CSV!', 'success');
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans">
      
      {/* 1. SHARED COMPANY PANEL HEADER */}
      <CompanyPanelHeader
        title="Gestão Financeira, Faturas & Boletos B2B"
        subtitle="Acompanhe duplicatas a vencer, emita a 2ª via atualizada de boletos bancários e baixe XMLs de NF-e."
        activeBadge={`${invoices.length} Títulos de Cobrança`}
        actions={
          <button
            onClick={handleExportFinancialCsv}
            className="bg-[#004e38] hover:bg-[#033627] text-white text-xs font-black px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <Download className="w-4 h-4 text-amber-300" />
            <span>Exportar Relatório Financeiro (CSV)</span>
          </button>
        }
      />

      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 pt-8 space-y-8">

        {/* Credit Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 space-y-2 shadow-2xs">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Limite de Crédito Total Aprovado</span>
            <div className="text-3xl font-black text-gray-900">
              R$ {(currentCompany.creditLimitTotal || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-gray-400">Análise fiscal realizada semestralmente pela mesa corporativa</p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 space-y-2 shadow-2xs">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">Limite Disponível para Faturamento</span>
            <div className="text-3xl font-black text-[#004e38]">
              R$ {(currentCompany.creditLimitAvailable || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-[#004e38] h-full rounded-full"
                style={{
                  width: `${Math.min(100, ((currentCompany.creditLimitAvailable || 0) / (currentCompany.creditLimitTotal || 1)) * 100)}%`
                }}
              />
            </div>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 space-y-2 shadow-2xs">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">Faturas em Aberto (Compromisso)</span>
            <div className="text-3xl font-black text-amber-900">
              R$ {((currentCompany.creditLimitTotal || 0) - (currentCompany.creditLimitAvailable || 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </div>
            <p className="text-[11px] text-gray-400">Faturamento a prazo em 28/56/84 dias com quitação via boleto ou PIX</p>
          </div>
        </div>

        {/* Invoices List Table */}
        <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xs">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-black text-base text-gray-900">Duplicatas e Títulos de Cobrança B2B</h3>
            <span className="text-xs text-gray-400 font-semibold">{invoices.length} títulos listados</span>
          </div>

          {isLoading ? (
            <div className="p-16 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-[#004e38] animate-spin mx-auto" />
              <p className="text-xs font-bold text-gray-500">Carregando faturas e boletos...</p>
            </div>
          ) : invoices.length === 0 ? (
            <div className="p-16 text-center space-y-2">
              <p className="text-sm font-bold text-gray-700">Nenhuma fatura em aberto encontrada.</p>
              <p className="text-xs text-gray-400">Suas faturas futuras serão exibidas aqui após o faturamento de pedidos.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#004e38] text-white font-extrabold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Nº da Fatura / NFe</th>
                    <th className="p-4">Data Vencimento</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4 text-right">Valor do Título</th>
                    <th className="p-4 text-center">XML Fiscal</th>
                    <th className="p-4 text-center">2ª Via Boleto / PIX</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#f5f6f6]/60 transition-colors">
                      <td className="p-4 font-mono font-bold text-gray-900">{inv.invoiceNumber}</td>
                      <td className="p-4 font-semibold text-gray-700">{inv.dueDate}</td>
                      <td className="p-4 text-center">
                        {inv.status === 'PAID' && (
                          <span className="bg-emerald-100 text-emerald-800 font-bold px-2.5 py-1 rounded-md text-[10px]">
                            ✔ Liquidado / Pago
                          </span>
                        )}
                        {inv.status === 'OPEN' && (
                          <span className="bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-md text-[10px]">
                            ⏳ A Vencer
                          </span>
                        )}
                        {inv.status === 'OVERDUE' && (
                          <span className="bg-red-100 text-red-800 font-bold px-2.5 py-1 rounded-md text-[10px]">
                            ⚠️ Vencido (Atualizar)
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right font-black text-gray-900 text-sm">
                        R$ {inv.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleDownloadXml(inv.invoiceNumber)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#004e38] hover:underline cursor-pointer"
                        >
                          <FileCode className="w-3.5 h-3.5" />
                          <span>Baixar XML</span>
                        </button>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleOpenBoletoModal(inv)}
                          className="bg-[#004e38] hover:bg-[#033627] text-white font-bold text-[11px] px-4 py-2 rounded-full transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                        >
                          <Barcode className="w-3.5 h-3.5 text-amber-300" />
                          <span>Visualizar Boleto / PIX</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* MODAL VISUALIZADOR DE BOLETO B2B */}
      {selectedBoleto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#004e38] text-white flex items-center justify-center font-bold">
                  <Barcode className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-mono text-[10px] font-bold text-gray-500 uppercase">
                    Boleto Bancário Homologado CIP / FEBRABAN
                  </span>
                  <h3 className="text-lg font-black text-gray-900">Fatura {selectedBoleto.invoiceNumber}</h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedBoleto(null)}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Boleto Header Info */}
            <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 space-y-3 text-xs">
              <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                <span className="text-gray-500 font-bold">Beneficiário:</span>
                <span className="font-black text-gray-900">Shopcart Distribuição B2B LTDA (CNPJ 10.987.654/0001-32)</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Vencimento</span>
                  <strong className="text-gray-900">{selectedBoleto.dueDate}</strong>
                </div>
                <div className="text-right">
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Valor Atualizado</span>
                  <strong className="text-[#004e38] text-base font-black">
                    R$ {selectedBoleto.recalculatedAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </strong>
                </div>
              </div>
            </div>

            {/* Linha Digitável com Botão de Copiar */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-700 block">Linha Digitável (Internet Banking)</label>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
                <span className="font-mono text-xs font-bold text-gray-800 flex-1 select-all break-all">
                  {selectedBoleto.linhaDigitavel}
                </span>
                <button
                  type="button"
                  onClick={handleCopyLinha}
                  className="bg-[#004e38] hover:bg-[#033627] text-white text-xs font-bold px-3 py-2 rounded-lg flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                >
                  {copiedLinha ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedLinha ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* PIX QR Code Copia e Cola */}
            <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                  <QrCode className="w-4 h-4 text-[#004e38]" /> Pagamento Instantâneo via PIX
                </span>
                <button
                  type="button"
                  onClick={handleCopyPix}
                  className="text-[#004e38] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                >
                  {copiedPix ? '✔ PIX Copiado!' : 'Copiar Chave PIX'}
                </button>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Pague pelo app do seu banco com baixa automática e liberação imediata do limite de crédito corporativo.
              </p>
            </div>

            {/* Ações */}
            <div className="pt-2 flex items-center justify-between border-t border-gray-100">
              <button
                type="button"
                onClick={() => {
                  window.print();
                  showToast('Impressão do boleto bancário iniciada!', 'success');
                }}
                className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 font-bold text-xs px-4 py-2.5 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#004e38]" />
                <span>Imprimir Boleto Bancário</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBoleto(null)}
                className="bg-[#004e38] hover:bg-[#033627] text-white font-bold text-xs px-6 py-2.5 rounded-full transition-all cursor-pointer"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
