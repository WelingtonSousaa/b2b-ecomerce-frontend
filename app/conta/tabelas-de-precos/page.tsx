'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Tag,
  Plus,
  Search,
  CheckCircle2,
  Download,
  X,
  Building2,
  Trash2,
  Edit3,
  ExternalLink,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { priceBooksService } from '@/services/pricebooks.service';
import { PriceBook, PriceBookItem } from '@/types/b2b';
import CompanyPanelHeader from '@/components/layout/CompanyPanelHeader';
import { useToast } from '@/context/ToastContext';

export default function TabelasDePrecosPage() {
  const { showToast } = useToast();
  const [priceBooks, setPriceBooks] = useState<PriceBook[]>([]);
  const [selectedPb, setSelectedPb] = useState<PriceBook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals state

  // New Price Book modal state

  // Add Item to PB modal state

  React.useEffect(() => {
    priceBooksService.getPriceBooks()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setPriceBooks(res.data);
          setSelectedPb(res.data[0]);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const filteredItems = selectedPb?.items?.filter(item =>
    item.productName?.toLowerCase().includes(search.toLowerCase()) ||
    item.sku?.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const handleExportXls = () => {
    if (!selectedPb) return;
    const headers = ['Codigo_Tabela', 'Nome_Tabela', 'SKU', 'Produto', 'Preco_Contrato_B2B', 'MOQ_Minimo', 'Desconto_Percentual'];
    const rows = selectedPb.items.map(item => [
      `"${selectedPb.code}"`,
      `"${selectedPb.name}"`,
      `"${item.sku}"`,
      `"${item.productName}"`,
      item.customPrice.toFixed(2),
      item.minMoqOverride || 1,
      `${item.discountPercentageFromBase}%`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tabela_precos_${selectedPb.code.toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Tabela de preços "${selectedPb.name}" exportada com sucesso!`, 'success');
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans">
      
      {/* 1. SHARED COMPANY PANEL HEADER */}
      <CompanyPanelHeader
        title="Tabelas de Preços Negociadas (Price Books)"
        subtitle="Gestão de tabelas de preços exclusivas vinculadas a contratos, CNPJs parceiros e regiões tributárias."
        activeBadge={`${priceBooks.length} Tabelas Ativas`}
        actions={
          <>
            <button
              onClick={handleExportXls}
              className="bg-white hover:bg-gray-100 text-gray-800 border border-gray-200 text-xs font-bold px-4 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Tabela (CSV/XLS)</span>
            </button>

            <Link
              href="/conta/tabelas-de-precos/nova"
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-black px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Nova Tabela de Preço</span>
            </Link>
          </>
        }
      />

      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 pt-8 space-y-8">
        
        {/* 2-Column Grid: Price Books Selector + Items View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: LIST OF PRICE BOOKS */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-wider">
                Tabelas Contratuais ({priceBooks.length})
              </h2>
              <span className="text-xs text-[#2563eb] font-bold">100% Sincronizado</span>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-gray-200 shadow-2xs">
                  <Tag className="w-6 h-6 text-[#2563eb] animate-spin mx-auto mb-2" />
                  <p className="text-xs font-bold text-gray-500">Carregando tabelas de preço...</p>
                </div>
              ) : priceBooks.map((pb) => {
                const isSelected = selectedPb?.id === pb.id;
                return (
                  <div
                    key={pb.id}
                    onClick={() => setSelectedPb(pb)}
                    className={`p-5 rounded-3xl border-2 transition-all cursor-pointer space-y-2.5 ${
                      isSelected
                        ? 'border-[#2563eb] bg-white shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="bg-blue-50 text-[#2563eb] font-mono font-black text-[10px] px-2.5 py-0.5 rounded-full border border-blue-200">
                        {pb.code}
                      </span>
                      <span className="text-[10px] font-black text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-blue-600" /> Ativa
                      </span>
                    </div>

                    <h3 className="font-black text-sm text-gray-900 line-clamp-1">{pb.name}</h3>
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{pb.description}</p>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-gray-500" />
                        {pb.assignedCnpjs.length} CNPJ(s)
                      </span>
                      <span className="font-mono text-[#2563eb] font-bold">
                        {pb.items.length} Itens com Desconto
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT: SELECTED PRICE BOOK DETAIL & ITEMS TABLE */}
          <div className="lg:col-span-8 space-y-6">
            {!selectedPb ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center text-gray-400 text-xs">
                Selecione uma tabela de preços à esquerda para visualizar os itens cadastrados.
              </div>
            ) : (
              <>
                {/* Header Card of Selected Price Book */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="bg-[#2563eb] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                          {selectedPb.code}
                        </span>
                        <h2 className="text-xl font-black text-gray-900">{selectedPb.name}</h2>
                      </div>
                      <p className="text-xs text-gray-500">{selectedPb.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="bg-blue-100 text-[#2563eb] text-xs font-bold px-3 py-1 rounded-full">
                        Vigência: {selectedPb.validFrom} até {selectedPb.validTo}
                      </span>
                    </div>
                  </div>

                  {/* Badges de CNPJs e Regiões */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 space-y-1.5">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                        CNPJs Autorizados a Faturar por Esta Tabela
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPb.assignedCnpjs?.map((cnpj, idx) => (
                          <span key={idx} className="bg-white border border-gray-200 text-gray-800 font-mono text-[11px] font-bold px-2.5 py-1 rounded-lg">
                            {cnpj}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 space-y-1.5">
                      <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                        Estados & Regiões Válidas
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedPb.targetRegionUF && selectedPb.targetRegionUF.length > 0 ? (
                          selectedPb.targetRegionUF.map((uf, idx) => (
                            <span key={idx} className="bg-blue-50 border border-blue-200 text-[#2563eb] text-[11px] font-black px-2.5 py-1 rounded-lg">
                              UF: {uf}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-[11px]">Todo o Território Nacional</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Items Table in Selected Price Book */}
                <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xs">
                  <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="relative flex-1 max-w-xs">
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Filtrar por SKU ou Produto..."
                        className="w-full bg-[#f5f6f6] rounded-full py-2 pl-3 pr-8 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
                      />
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-2.5" />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 font-semibold">{filteredItems.length} Itens Vinculados</span>
                      <button
                        onClick={() => alert("Função em desenvolvimento. Agora terá página própria.")}
                        className="bg-[#2563eb] hover:bg-[#033627] text-white font-black text-xs px-4 py-2 rounded-full transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-300" />
                        <span>Adicionar Item à Tabela</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#2563eb] text-white font-extrabold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="p-4">SKU / Mercadoria</th>
                          <th className="p-4 text-center">MOQ Mínimo</th>
                          <th className="p-4 text-right">Preço de Contrato (B2B)</th>
                          <th className="p-4 text-center">Desconto Negociado</th>
                          <th className="p-4 text-center">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {filteredItems.map((item, idx) => (
                          <tr key={idx} className="hover:bg-[#f8fafc] transition-colors">
                            <td className="p-4 space-y-0.5">
                              <span className="font-extrabold text-gray-900 block">{item.productName}</span>
                              <span className="font-mono text-[10px] text-gray-400 font-bold">{item.sku}</span>
                            </td>

                            <td className="p-4 text-center">
                              <span className="bg-gray-100 text-gray-800 text-[10px] font-bold px-2 py-0.5 rounded">
                                {item.minMoqOverride || 1} un
                              </span>
                            </td>

                            <td className="p-4 text-right font-black text-sm text-[#2563eb]">
                              R$ {item.customPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>

                            <td className="p-4 text-center">
                              <span className="bg-blue-50 text-blue-800 border border-blue-200 font-black text-[10px] px-2.5 py-0.5 rounded-full">
                                -{item.discountPercentageFromBase}% OFF
                              </span>
                            </td>

                            <td className="p-4 text-center">
                              <Link
                                href={`/produto/${item.sku}`}
                                className="text-[#2563eb] hover:underline text-[11px] font-bold inline-flex items-center gap-1"
                              >
                                <span>Ver Catálogo</span>
                                <ArrowRight className="w-3 h-3" />
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
