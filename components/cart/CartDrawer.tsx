'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  Star,
  ArrowRight,
  ShieldCheck,
  FileText,
  ChevronDown,
  Info,
  Sparkles,
  PackageOpen
} from 'lucide-react';
import CommercialProposalModal from '@/components/modals/CommercialProposalModal';
import CargoSimulator from '@/components/cart/CargoSimulator';
import { useCart } from '@/context/CartContext';

interface CartDrawerProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function CartDrawer({ isOpen: propsIsOpen, onClose: propsOnClose }: CartDrawerProps) {
  const {
    items,
    isCartOpen: contextIsOpen,
    closeCart: contextCloseCart,
    updateQuantity,
    removeItem,
    fillPallet,
    clearCart,
    subtotal,
    totalTaxST,
    totalIPI,
    totalItemsCount,
  } = useCart();

  // Support both context control and prop control
  const isOpen = propsIsOpen !== undefined ? propsIsOpen : contextIsOpen;
  const handleClose = propsOnClose || contextCloseCart;

  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [showTaxDetails, setShowTaxDetails] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden font-sans animate-in fade-in duration-200">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={handleClose}
          aria-hidden="true"
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full">
            
            {/* 1. Header (Sticky) */}
            <div className="p-4 sm:p-5 bg-[#2563eb] text-white flex items-center justify-between shrink-0 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-white/10 rounded-xl">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight leading-none">Seu Carrinho B2B</h2>
                  <span className="text-[11px] text-blue-100 font-medium">
                    {items.length} {items.length === 1 ? 'produto' : 'produtos'} ({totalItemsCount} un.)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {items.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Deseja realmente esvaziar o carrinho corporativo?')) {
                        clearCart();
                      }
                    }}
                    className="p-1.5 rounded-xl hover:bg-white/15 text-blue-100 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 mr-1"
                    title="Esvaziar todo o carrinho"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-medium hidden sm:inline">Limpar</span>
                  </button>
                )}
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-xl hover:bg-white/15 text-white transition-colors cursor-pointer"
                  title="Fechar Carrinho"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 2. Scrollable Body: Items + Simulator + Taxes */}
            <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-5 space-y-4 [scrollbar-width:thin] scrollbar-thumb-slate-200 hover:scrollbar-thumb-slate-300">
              
              {/* Empty State */}
              {items.length === 0 ? (
                <div className="text-center py-16 px-4 space-y-4">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto">
                    <PackageOpen className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-gray-900">Seu carrinho corporativo está vazio</h3>
                    <p className="text-xs text-gray-500 max-w-xs mx-auto">
                      Explore nosso catálogo B2B com preços faturados por CNPJ, estoque por Centro de Distribuição e incentivos de frete.
                    </p>
                  </div>
                  <Link
                    href="/produtos"
                    onClick={handleClose}
                    className="inline-flex items-center gap-2 bg-[#2563eb] text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-[#1d4ed8] transition-all shadow-sm"
                  >
                    <span>Explorar Produtos</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                <>
                  {/* Items List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-500 font-medium px-1">
                      <span>Itens Selecionados</span>
                      <span>Preço Faturado</span>
                    </div>

                    {items.map((item) => {
                      const imageSrc = imageErrors[item.id] || !item.image
                        ? '/placeholder.jpg'
                        : item.image;

                      return (
                        <div
                          key={item.id}
                          className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-2xs hover:border-blue-200 transition-all space-y-3"
                        >
                          <div className="flex gap-3.5">
                            {/* Product Image */}
                            <div className="relative w-18 h-18 bg-[#f8fafc] rounded-xl p-1 shrink-0 flex items-center justify-center overflow-hidden border border-slate-100">
                              <Image
                                src={imageSrc}
                                alt={item.name}
                                fill
                                sizes="72px"
                                className="object-contain p-1"
                                onError={() => {
                                  setImageErrors((prev) => ({ ...prev, [item.id]: true }));
                                }}
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0 space-y-1">
                              <div className="flex items-start justify-between gap-1.5">
                                <div className="min-w-0">
                                  <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-gray-400 uppercase tracking-wide">
                                    <span>{item.sku}</span>
                                    {item.ncm && (
                                      <>
                                        <span>•</span>
                                        <span>NCM {item.ncm}</span>
                                      </>
                                    )}
                                  </div>
                                  <h4 className="text-xs font-bold text-gray-900 line-clamp-2 leading-snug" title={item.name}>
                                    {item.name}
                                  </h4>
                                </div>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors p-1.5 rounded-lg shrink-0 cursor-pointer"
                                  title="Remover do carrinho"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>

                              {/* Rating & Review */}
                              <div className="flex items-center gap-1 text-[10px] text-gray-400">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-2.5 h-2.5 fill-[#16a34a] text-[#16a34a]" />
                                  ))}
                                </div>
                                <span>({item.reviewCount || 48})</span>
                              </div>
                            </div>
                          </div>

                          {/* Controls & Price Row */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                            <div className="flex items-center bg-[#f1f5f9] rounded-lg p-0.5">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                disabled={item.quantity <= 1}
                                className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer rounded-md hover:bg-white"
                                title="Diminuir quantidade"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 text-center text-xs font-bold text-gray-900 font-mono">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer rounded-md hover:bg-white"
                                title="Aumentar quantidade"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <div className="text-right">
                              <div className="text-[10px] text-gray-400">
                                un. R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </div>
                              <span className="font-extrabold text-[#2563eb] text-sm">
                                R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 3. Logistics & Pallet Simulation Widget */}
                  <div className="pt-2">
                    <CargoSimulator
                      items={items.map((it) => ({
                        id: it.id,
                        name: it.name,
                        quantity: it.quantity,
                      }))}
                      onFillPallet={fillPallet}
                    />
                  </div>

                  {/* 4. Tax Calculation Breakdown Accordion */}
                  <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-3 text-xs transition-all">
                    <button
                      onClick={() => setShowTaxDetails(!showTaxDetails)}
                      className="w-full flex items-center justify-between font-bold text-[#2563eb] text-[11px] cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" />
                        <span>Demonstrativo Fiscal (ICMS / ST / IPI)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-slate-800">
                          R$ {(totalTaxST + totalIPI).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTaxDetails ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {showTaxDetails && (
                      <div className="pt-2.5 space-y-1.5 text-[10px] text-gray-600 border-t border-blue-200/60 mt-2">
                        <div className="flex justify-between">
                          <span>ICMS Operação Própria (18%):</span>
                          <span className="font-semibold text-gray-900">Incluso no valor base</span>
                        </div>
                        <div className="flex justify-between">
                          <span>ICMS-ST (Substituição Tributária):</span>
                          <span className="font-bold text-gray-900">
                            R$ {totalTaxST.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>IPI Destacado (5%):</span>
                          <span className="font-bold text-gray-900">
                            R$ {totalIPI.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                        <div className="text-[9px] text-gray-400 pt-1">
                          * Cálculo estimado para emissão de NF-e corporativa com Inscrição Estadual ativa.
                        </div>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* 5. Sticky Footer Summary & CTAs */}
            {items.length > 0 && (
              <div className="p-4 sm:p-5 bg-[#f8fafc] border-t border-slate-200 space-y-3 shrink-0 shadow-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-gray-600">Subtotal dos Produtos:</span>
                  <span className="text-[#2563eb] font-extrabold text-base">
                    R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200/70">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">Frete CIF segurado para todos os Centros de Distribuição</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    onClick={() => setIsProposalOpen(true)}
                    className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 py-3 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                  >
                    <FileText className="w-4 h-4 text-slate-600" />
                    <span>Proposta PDF</span>
                  </button>

                  <Link
                    href="/checkout"
                    onClick={handleClose}
                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3 px-3 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <span>Ir para Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Commercial Proposal PDF Modal */}
      <CommercialProposalModal
        isOpen={isProposalOpen}
        onClose={() => setIsProposalOpen(false)}
        items={items.map((i) => ({
          id: i.id,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          sku: i.sku,
        }))}
        subtotal={subtotal}
      />
    </>
  );
}
