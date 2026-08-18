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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);

  // New Price Book modal state
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCnpjs, setNewCnpjs] = useState('12.345.678/0001-90');
  const [newRegions, setNewRegions] = useState('SP, RJ, MG');

  // Add Item to PB modal state
  const [itemSku, setItemSku] = useState('SKU-HEAD-02');
  const [itemName, setItemName] = useState('Headphone Studio Pro Hi-Res');
  const [itemPrice, setItemPrice] = useState<number>(389.00);
  const [itemMoq, setItemMoq] = useState<number>(5);
  const [itemDiscount, setItemDiscount] = useState<number>(15);

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

  const handleCreatePriceBook = (e: React.FormEvent) => {
    e.preventDefault();
    const newBook: PriceBook = {
      id: `pb-${Date.now()}`,
      name: newName,
      code: newCode.toUpperCase(),
      description: newDescription,
      isActive: true,
      validFrom: '2026-08-01',
      validTo: '2027-08-01',
      assignedCnpjs: newCnpjs.split(',').map(c => c.trim()),
      targetRegionUF: newRegions.split(',').map(r => r.trim()),
      items: [
        {
          sku: 'SKU-HEAD-01',
          productName: 'Wireless Earbuds IPX8 Noise Canceling',
          customPrice: 420.00,
          minMoqOverride: 2,
          discountPercentageFromBase: 14.1
        },
        {
          sku: 'SKU-PHONE-BLK-128',
          productName: 'Smartphone Galaxy Enterprise 5G 128GB',
          customPrice: 3100.00,
          minMoqOverride: 2,
          discountPercentageFromBase: 11.4
        }
      ]
    };

    setPriceBooks(prev => [newBook, ...prev]);
    setSelectedPb(newBook);
    setIsCreateModalOpen(false);
    showToast(`Tabela de Preço "${newName}" criada com sucesso!`, 'success');

    priceBooksService.createPriceBook(newBook).then(res => {
      if (res.data) {
        setPriceBooks(prev => prev.map(pb => pb.id === newBook.id ? res.data : pb));
        setSelectedPb(res.data);
      }
    }).catch(() => {});

    setNewName('');
    setNewCode('');
    setNewDescription('');
  };

  const handleAddItemToPriceBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPb) return;

    const newItem: PriceBookItem = {
      sku: itemSku,
      productName: itemName,
      customPrice: Number(itemPrice),
      minMoqOverride: Number(itemMoq),
      discountPercentageFromBase: Number(itemDiscount)
    };

    const updatedPb = {
      ...selectedPb,
      items: [...selectedPb.items, newItem]
    };

    setSelectedPb(updatedPb);
    setPriceBooks(prev => prev.map(p => p.id === updatedPb.id ? updatedPb : p));
    setIsAddItemModalOpen(false);
    showToast(`SKU "${itemSku}" adicionado à tabela "${selectedPb.name}"!`, 'success');

    priceBooksService.addItemToPriceBook(selectedPb.id, newItem).catch(() => {});
  };

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

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-[#004e38] hover:bg-[#033627] text-white text-xs font-black px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Nova Tabela de Preço</span>
            </button>
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
              <span className="text-xs text-[#004e38] font-bold">100% Sincronizado</span>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-gray-200 shadow-2xs">
                  <Tag className="w-6 h-6 text-[#004e38] animate-spin mx-auto mb-2" />
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
                        ? 'border-[#004e38] bg-white shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-2xs'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="bg-emerald-50 text-[#004e38] font-mono font-black text-[10px] px-2.5 py-0.5 rounded-full border border-emerald-200">
                        {pb.code}
                      </span>
                      <span className="text-[10px] font-black text-emerald-700 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Ativa
                      </span>
                    </div>

                    <h3 className="font-black text-sm text-gray-900 line-clamp-1">{pb.name}</h3>
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">{pb.description}</p>

                    <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-400 font-semibold">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3 text-gray-500" />
                        {pb.assignedCnpjs.length} CNPJ(s)
                      </span>
                      <span className="font-mono text-[#004e38] font-bold">
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
                        <span className="bg-[#004e38] text-white font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                          {selectedPb.code}
                        </span>
                        <h2 className="text-xl font-black text-gray-900">{selectedPb.name}</h2>
                      </div>
                      <p className="text-xs text-gray-500">{selectedPb.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="bg-emerald-100 text-[#004e38] text-xs font-bold px-3 py-1 rounded-full">
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
                            <span key={idx} className="bg-emerald-50 border border-emerald-200 text-[#004e38] text-[11px] font-black px-2.5 py-1 rounded-lg">
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
                        className="w-full bg-[#f5f6f6] rounded-full py-2 pl-3 pr-8 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#004e38]"
                      />
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-2.5" />
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 font-semibold">{filteredItems.length} Itens Vinculados</span>
                      <button
                        onClick={() => setIsAddItemModalOpen(true)}
                        className="bg-[#004e38] hover:bg-[#033627] text-white font-black text-xs px-4 py-2 rounded-full transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5 text-amber-300" />
                        <span>Adicionar Item à Tabela</span>
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#004e38] text-white font-extrabold uppercase text-[10px] tracking-wider">
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

                            <td className="p-4 text-right font-black text-sm text-[#004e38]">
                              R$ {item.customPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>

                            <td className="p-4 text-center">
                              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-black text-[10px] px-2.5 py-0.5 rounded-full">
                                -{item.discountPercentageFromBase}% OFF
                              </span>
                            </td>

                            <td className="p-4 text-center">
                              <Link
                                href={`/produto/${item.sku}`}
                                className="text-[#004e38] hover:underline text-[11px] font-bold inline-flex items-center gap-1"
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

      {/* MODAL 1: CRIAR NOVA TABELA DE PREÇOS */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
          <div className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-xl overflow-hidden relative flex flex-col">
            
            <div className="bg-[#004e38] text-white p-6 relative">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-5 right-5 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <Tag className="w-5 h-5 text-amber-300" />
                <h3 className="text-xl font-black">Criar Tabela de Preços Negociada</h3>
              </div>
              <p className="text-xs text-emerald-100">
                Cadastre condições comerciais exclusivas para um contrato corporativo ou região.
              </p>
            </div>

            <form onSubmit={handleCreatePriceBook} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Nome da Tabela *</label>
                  <input
                    type="text"
                    required
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Ex: Tabela Parceiros Tier 1"
                    className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl p-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Código Interno / ERP *</label>
                  <input
                    type="text"
                    required
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="Ex: PB-TIER1-2026"
                    className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl p-2.5 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Descrição Comercial</label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Justificativa do acordo comercial..."
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">CNPJs Autorizados (separados por vírgula)</label>
                <input
                  type="text"
                  value={newCnpjs}
                  onChange={(e) => setNewCnpjs(e.target.value)}
                  placeholder="Ex: 12.345.678/0001-90, 98.765.432/0001-11"
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl p-2.5 font-mono focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Estados / Regiões Válidas (UFs)</label>
                <input
                  type="text"
                  value={newRegions}
                  onChange={(e) => setNewRegions(e.target.value)}
                  placeholder="Ex: SP, RJ, MG, PR"
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-full font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#004e38] hover:bg-[#033627] text-white font-black px-6 py-2 rounded-full shadow-xs cursor-pointer"
                >
                  Salvar Tabela de Preço
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* MODAL 2: ADICIONAR ITEM À TABELA SELECIONADA */}
      {isAddItemModalOpen && selectedPb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
          <div className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-lg overflow-hidden relative flex flex-col">
            
            <div className="bg-[#004e38] text-white p-6 relative">
              <button
                onClick={() => setIsAddItemModalOpen(false)}
                className="absolute top-5 right-5 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <Plus className="w-5 h-5 text-amber-300" />
                <h3 className="text-xl font-black">Adicionar Item com Preço Negociado</h3>
              </div>
              <p className="text-xs text-emerald-100">
                Tabela de Destino: <strong>{selectedPb.name} ({selectedPb.code})</strong>
              </p>
            </div>

            <form onSubmit={handleAddItemToPriceBook} className="p-6 space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-gray-700">Código SKU do Produto *</label>
                <input
                  type="text"
                  required
                  value={itemSku}
                  onChange={(e) => setItemSku(e.target.value)}
                  placeholder="Ex: SKU-AUDIO-PRO-01"
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl p-2.5 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Ex: Fone Headphone Wireless Pro Studio"
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl p-2.5 font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Preço B2B (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={itemPrice}
                    onChange={(e) => setItemPrice(Number(e.target.value))}
                    className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl p-2.5 font-black text-[#004e38]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Lote Mínimo (MOQ)</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={itemMoq}
                    onChange={(e) => setItemMoq(Number(e.target.value))}
                    className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl p-2.5 font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700">Desconto (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={itemDiscount}
                    onChange={(e) => setItemDiscount(Number(e.target.value))}
                    className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl p-2.5 font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsAddItemModalOpen(false)}
                  className="px-4 py-2 rounded-full font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#004e38] hover:bg-[#033627] text-white font-black px-6 py-2 rounded-full shadow-xs cursor-pointer"
                >
                  Adicionar ao Price Book
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
