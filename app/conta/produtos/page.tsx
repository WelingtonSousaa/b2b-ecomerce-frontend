'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowLeft,
  Search,
  Layers,
  Loader2,
  ShoppingCart,
  CheckCircle2,
  Truck,
  Filter,
  Plus,
  Minus,
  Sparkles,
  Tag,
  ArrowRight
} from 'lucide-react';
import { productsService } from '@/services/products.service';
import { Product } from '@/types/b2b';
import { useToast } from '@/context/ToastContext';

export default function GestaoProdutosPage() {
  const { showToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  const [addedItemSku, setAddedItemSku] = useState<string | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    productsService.getProducts()
      .then((res) => {
        if (res.data) {
          setProducts(res.data);
          const initialQtys: Record<string, number> = {};
          res.data.forEach(p => {
            initialQtys[p.id] = p.moq || 1;
          });
          setQuantities(initialQtys);
        }
      })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const categories = [
    { label: 'Todas as Categorias', value: 'TODOS' },
    { label: 'Fones & Áudio', value: 'headphones' },
    { label: 'Smartphones & TI', value: 'laptops' },
    { label: 'Acessórios Corporativos', value: 'acessorios' },
  ];

  const filtered = products.filter(p => {
    const matchesCat = selectedCategory === 'TODOS' || p.categorySlug === selectedCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.categorySlug && p.categorySlug.toLowerCase().includes(search.toLowerCase())) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleQtyChange = (prodId: string, delta: number, moq: number) => {
    setQuantities(prev => {
      const current = prev[prodId] || moq;
      const updated = Math.max(moq, current + delta);
      return { ...prev, [prodId]: updated };
    });
  };

  const handleQuickAdd = (prod: Product) => {
    const qty = quantities[prod.id] || prod.moq || 1;
    if (typeof window !== 'undefined') {
      try {
        const existing = JSON.parse(localStorage.getItem('b2b_checkout_items') || '[]');
        const existingIdx = existing.findIndex((item: { sku: string }) => item.sku === prod.sku);
        if (existingIdx >= 0) {
          existing[existingIdx].quantity += qty;
          existing[existingIdx].totalPrice = existing[existingIdx].quantity * prod.basePrice;
        } else {
          existing.push({
            productId: prod.id,
            sku: prod.sku,
            name: prod.name,
            quantity: qty,
            unitPrice: prod.basePrice,
            totalPrice: prod.basePrice * qty
          });
        }
        localStorage.setItem('b2b_checkout_items', JSON.stringify(existing));
      } catch {
        const items = [{
          productId: prod.id,
          sku: prod.sku,
          name: prod.name,
          quantity: qty,
          unitPrice: prod.basePrice,
          totalPrice: prod.basePrice * qty
        }];
        localStorage.setItem('b2b_checkout_items', JSON.stringify(items));
      }
    }
    setAddedItemSku(prod.sku);
    showToast(`${qty} un. do item "${prod.name}" adicionadas ao lote de faturamento!`, 'success');
    setTimeout(() => setAddedItemSku(null), 2000);
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 pt-8 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 space-y-8">
        
        {/* Header Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-4 gap-4">
          <div>
            <Link href="/conta" className="inline-flex items-center gap-1 text-xs font-bold text-[#004e38] mb-2 hover:underline">
              <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
            </Link>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">Catálogo de Lotes & Descontos por Volume</h1>
            <p className="text-xs text-gray-500 mt-1">
              Consulte preços escalonados por quantidade (Tiers B2B), alçadas de desconto progressivo e saldo nos Centros de Distribuição.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/conta/estoque"
              className="bg-white hover:bg-emerald-50 text-[#004e38] border border-emerald-300 text-xs font-bold px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Tag className="w-4 h-4 text-[#004e38]" />
              <span>Gestão de Estoque Vendedor</span>
            </Link>

            <Link
              href="/quick-order"
              className="bg-[#004e38] hover:bg-[#033627] text-white text-xs font-bold px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Layers className="w-4 h-4 text-amber-300" />
              <span>Pedido Rápido via CSV</span>
            </Link>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="relative flex-1 max-w-md w-full">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Pesquisar por nome do produto, SKU, marca ou categoria..."
              className="w-full bg-[#f5f6f6] rounded-full py-2.5 pl-4 pr-10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#004e38]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
          </div>

          <div className="flex items-center gap-2 font-bold shrink-0">
            <Filter className="w-4 h-4 text-[#004e38]" />
            <span>Filtrar Categoria:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#f5f6f6] rounded-full px-4 py-2 font-bold text-gray-900 focus:outline-none cursor-pointer"
            >
              {categories.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="p-16 text-center space-y-3 bg-white rounded-3xl border border-gray-200 shadow-2xs">
            <Loader2 className="w-8 h-8 text-[#004e38] animate-spin mx-auto" />
            <p className="text-xs font-bold text-gray-500">Carregando catálogo corporativo e preços...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center space-y-3 bg-white rounded-3xl border border-gray-200 shadow-2xs">
            <Tag className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-700">Nenhum produto encontrado para sua busca.</p>
            <p className="text-xs text-gray-400">Tente ajustar os termos de pesquisa ou o filtro de categoria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((prod) => {
              const totalStock = prod.stockByCD ? prod.stockByCD.reduce((acc, c) => acc + c.availableQuantity, 0) : 100;
              const currentQty = quantities[prod.id] || prod.moq || 1;
              const subtotal = currentQty * prod.basePrice;

              return (
                <div key={prod.id} className="bg-white p-6 rounded-3xl border border-gray-200 space-y-4 shadow-2xs hover:border-[#004e38] transition-all flex flex-col justify-between group">
                  <div className="space-y-4">
                    <div className="flex gap-4 items-center">
                      <div className="w-20 h-20 bg-[#f5f6f6] rounded-2xl p-2 relative flex items-center justify-center shrink-0 border border-gray-100 group-hover:scale-105 transition-transform">
                        <Image
                          src={prod.images?.[0] || '/media/img2.jpeg'}
                          alt={prod.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            {prod.sku}
                          </span>
                          <span className="text-[10px] text-gray-400 font-semibold">{prod.brand}</span>
                        </div>
                        <h3 className="font-black text-xs text-gray-900 line-clamp-2">{prod.name}</h3>
                        <p className="text-[#004e38] font-black text-sm">
                          R$ {prod.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          <span className="text-[10px] font-normal text-gray-400 ml-1">/ {prod.uom || 'UN'}</span>
                        </p>
                      </div>
                    </div>

                    {/* Stock by Distribution Center */}
                    <div className="bg-[#f8fafc] p-3 rounded-2xl border border-gray-100 text-[11px] space-y-1.5">
                      <div className="flex justify-between items-center text-gray-600 font-bold">
                        <span className="flex items-center gap-1">
                          <Truck className="w-3.5 h-3.5 text-[#004e38]" /> Disponibilidade nos CDs:
                        </span>
                        <span className="text-emerald-700 font-black">{totalStock} un.</span>
                      </div>
                      {prod.stockByCD && prod.stockByCD.length > 0 && (
                        <div className="grid grid-cols-2 gap-1 text-[10px] text-gray-500 font-medium">
                          {prod.stockByCD.map(cd => (
                            <div key={cd.cdId} className="flex justify-between bg-white px-2 py-1 rounded border border-gray-100">
                              <span>{cd.cdStateUF}:</span>
                              <strong className="text-gray-800">{cd.availableQuantity} un</strong>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Volume Discount Tier Preview */}
                    {prod.volumeDiscounts && prod.volumeDiscounts.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                          Tabela de Desconto por Lote (Tiers B2B)
                        </span>
                        <div className="space-y-1 text-[11px]">
                          {prod.volumeDiscounts.map((tier, idx) => (
                            <div key={idx} className="flex justify-between bg-emerald-50/50 px-2.5 py-1 rounded-lg text-[#004e38]">
                              <span>A partir de {tier.minQuantity} un:</span>
                              <strong>{tier.discountPercentage}% OFF (R$ {tier.unitPrice.toFixed(2)})</strong>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quantity Selector & Quick Add */}
                  <div className="border-t border-gray-100 pt-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500">MOQ Mínimo: {prod.moq} un</span>
                      <div className="flex items-center gap-1.5 bg-[#f5f6f6] p-1 rounded-full border border-gray-200">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(prod.id, -1, prod.moq)}
                          disabled={currentQty <= prod.moq}
                          className="w-6 h-6 rounded-full bg-white text-gray-700 flex items-center justify-center hover:bg-gray-200 disabled:opacity-40 cursor-pointer"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono font-bold text-xs px-2 text-gray-900">{currentQty}</span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(prod.id, 1, prod.moq)}
                          className="w-6 h-6 rounded-full bg-white text-gray-700 flex items-center justify-center hover:bg-gray-200 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="text-left">
                        <span className="text-[10px] text-gray-400 block">Subtotal do Lote</span>
                        <span className="font-black text-xs text-gray-900">
                          R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleQuickAdd(prod)}
                        className="bg-[#004e38] hover:bg-[#033627] text-white font-bold text-xs px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        {addedItemSku === prod.sku ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-amber-300" />
                            <span>Adicionado!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3.5 h-3.5" />
                            <span>Adicionar Lote</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}

