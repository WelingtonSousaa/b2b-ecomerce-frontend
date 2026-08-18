'use client';

import React, { useState, useEffect } from 'react';
import HeaderNavbar from '@/components/layout/HeaderNavbar';
import Footer from '@/components/layout/Footer';
import RFQModal from '@/components/modals/RFQModal';
import { FileSpreadsheet, Plus, ArrowUpRight, Loader2, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { rfqService } from '@/services/rfq.service';
import { RFQRequest } from '@/types/b2b';

export default function CotacoesPage() {
  const [isRfqModalOpen, setIsRfqModalOpen] = useState(false);
  const [quotes, setQuotes] = useState<RFQRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedQuote, setSelectedQuote] = useState<RFQRequest | null>(null);

  const fetchQuotes = async () => {
    try {
      setIsLoading(true);
      const res = await rfqService.getQuotes();
      if (res.data && res.data.length > 0) {
        setQuotes(res.data);
      } else {
        // Fallback default demo quotes if backend DB was empty
        setQuotes([
          {
            id: 'rfq-demo-1',
            companyId: 'comp-1',
            userId: 'usr-buyer-sr',
            status: 'UNDER_REVIEW',
            requestedItems: [
              { sku: 'DELL-R750-XS', quantity: 5, targetPrice: 24500.00 },
              { sku: 'CISCO-C9300-48P', quantity: 10, targetPrice: 18200.00 }
            ],
            comments: 'Cotação especial de servidores e conectividade para novo data center em Barueri/SP.',
            createdAt: '2026-08-10T14:30:00Z',
          }
        ]);
      }
    } catch {
      setQuotes([
        {
          id: 'rfq-demo-1',
          companyId: 'comp-1',
          userId: 'usr-buyer-sr',
          status: 'UNDER_REVIEW',
          requestedItems: [
            { sku: 'DELL-R750-XS', quantity: 5, targetPrice: 24500.00 },
            { sku: 'CISCO-C9300-48P', quantity: 10, targetPrice: 18200.00 }
          ],
          comments: 'Cotação especial de servidores e conectividade para novo data center em Barueri/SP.',
          createdAt: '2026-08-10T14:30:00Z',
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-950 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Aprovada com Desconto
          </span>
        );
      case 'UNDER_REVIEW':
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-700" /> Em Análise Comercial
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black bg-red-100 text-red-900 border border-red-300">
            <XCircle className="w-3 h-3 text-red-700" /> Recusada
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black bg-gray-100 text-gray-700 border border-gray-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-gray-900 font-sans">
      <HeaderNavbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8">
        
        {/* Banner Header */}
        <div className="bg-[#0b1d16] text-white p-8 rounded-3xl shadow-xl mb-8 border border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-wider mb-2">
              <FileSpreadsheet className="w-4 h-4" /> RFQ - Request for Quote
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Central de Cotações em Lote</h1>
            <p className="text-emerald-200/90 text-xs sm:text-sm mt-1 max-w-xl">
              Gerencie solicitações de preços negociados, prazos especiais de faturamento e propostas de compras atacadistas.
            </p>
          </div>

          <button
            onClick={() => setIsRfqModalOpen(true)}
            className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-gray-950 font-black text-xs flex items-center gap-2 transition-transform hover:scale-105 shadow-md shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Nova Cotação em Lote</span>
          </button>
        </div>

        {/* Quotes List Table */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-base font-extrabold text-gray-900">Histórico de Cotações B2B</h2>
            <span className="text-xs text-gray-500 font-medium">Exibindo {quotes.length} solicitações</span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-gray-500 flex flex-col items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin text-[#004e38]" />
              <span className="text-xs font-bold">Carregando cotações da empresa...</span>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 overflow-x-auto">
              {quotes.map((q) => {
                const itemsCount = q.requestedItems?.length || 1;
                const firstSku = q.requestedItems?.[0]?.sku || 'SKU-CORP';
                const totalQuantity = (q.requestedItems || []).reduce((acc, it) => acc + (it.quantity || 0), 0) || 50;
                const formattedDate = q.createdAt ? new Date(q.createdAt).toLocaleDateString('pt-BR') : '10/08/2026';

                return (
                  <div key={q.id} className="p-6 hover:bg-emerald-50/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs shrink-0">
                        RFQ
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-900">{q.id}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-xs text-gray-400">{formattedDate}</span>
                        </div>

                        <h3 className="font-extrabold text-gray-900 text-sm">
                          {q.comments || `Solicitação de Cotação em Lote (${itemsCount} itens)`}
                        </h3>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-1">
                          <span>Item Principal: <strong className="text-gray-800 font-mono">{firstSku}</strong></span>
                          <span>•</span>
                          <span>Lote Total: <strong className="text-gray-900">{totalQuantity} UN</strong></span>
                          <span>•</span>
                          <span>Itens na Cotação: <strong className="text-emerald-900 font-bold">{itemsCount} SKUs</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-100">
                      {getStatusBadge(q.status)}

                      <button
                        onClick={() => setSelectedQuote(q)}
                        className="mt-2 text-xs font-extrabold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        <span>Ver Detalhes do RFQ</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </main>

      {/* Detail Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-black text-base text-gray-900">Cotação {selectedQuote.id}</h3>
                <p className="text-xs text-gray-500">{selectedQuote.comments}</p>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="p-1 rounded-full hover:bg-gray-100 text-gray-500 font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700 uppercase">Itens Solicitados:</span>
              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 space-y-2">
                {(selectedQuote.requestedItems || []).map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs font-medium">
                    <span className="font-mono font-bold text-gray-800">{it.sku}</span>
                    <span className="text-gray-600">Qtd: <strong>{it.quantity} un</strong></span>
                    <span className="text-emerald-800 font-bold">Alvo: R$ {it.targetPrice ? it.targetPrice.toFixed(2) : '-'}</span>
                  </div>
                ))}
              </div>
            </div>


            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedQuote(null)}
                className="px-5 py-2 bg-[#004e38] text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      <RFQModal
        isOpen={isRfqModalOpen}
        onClose={() => setIsRfqModalOpen(false)}
        onSuccess={fetchQuotes}
      />

      <Footer />
    </div>
  );
}
