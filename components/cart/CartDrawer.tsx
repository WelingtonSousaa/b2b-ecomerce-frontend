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
  Info
} from 'lucide-react';
import CommercialProposalModal from '@/components/modals/CommercialProposalModal';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [showTaxDetails, setShowTaxDetails] = useState(false);

  const [items, setItems] = useState([
    {
      id: 'c1',
      name: 'AirPods Max',
      price: 2549.00,
      color: 'Rosa',
      rating: 5,
      reviewCount: 121,
      quantity: 1,
      image: '/media/airpods_max_pink.jpg',
      sku: '#83009',
      ncm: '8518.30.00',
      taxST: 114.70,
      ipi: 127.45
    },
    {
      id: 'c2',
      name: 'Fone Bluetooth Sem Fio, IPX8',
      price: 489.00,
      color: 'Preto',
      rating: 5,
      reviewCount: 121,
      quantity: 1,
      image: '/media/wireless_earbuds.jpg',
      sku: '#83001',
      ncm: '8518.30.00',
      taxST: 22.00,
      ipi: 24.45
    }
  ]);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalTaxST = items.reduce((acc, item) => acc + item.taxST * item.quantity, 0);
  const totalIPI = items.reduce((acc, item) => acc + item.ipi * item.quantity, 0);

  const handleUpdateQuantity = (itemId: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200 font-sans">
        
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
          onClick={onClose}
        />

        <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
            
            {/* Header */}
            <div className="p-5 bg-[#2563eb] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingCart className="w-5 h-5" />
                <h2 className="text-base font-bold tracking-tight">Seu Carrinho B2B</h2>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 divide-y divide-gray-100">
              {items.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto" />
                  <p className="text-sm font-bold text-gray-800">Seu carrinho está vazio</p>
                  <Link
                    href="/produtos"
                    onClick={onClose}
                    className="inline-block bg-[#2563eb] text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-[#1d4ed8] transition-colors mt-2"
                  >
                    Explorar Produtos
                  </Link>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                    
                    <div className="relative w-20 h-20 bg-[#f5f6f6] rounded-2xl p-2 shrink-0 flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                      />
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="font-mono text-[9px] text-gray-400 font-bold uppercase">{item.sku} | NCM: {item.ncm}</span>
                          <h4 className="text-xs font-bold text-gray-900 line-clamp-1">
                            {item.name}
                          </h4>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-0.5 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Green Star Rating */}
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-[#16a34a] text-[#16a34a]" />
                        ))}
                        <span className="text-[10px] text-gray-400 font-medium">({item.reviewCount})</span>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <div className="flex items-center bg-[#f5f6f6] rounded-full px-3 py-1 gap-3">
                          <button
                            onClick={() => handleUpdateQuantity(item.id, -1)}
                            className="text-gray-600 hover:text-gray-900 cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-gray-900">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.id, 1)}
                            className="text-gray-600 hover:text-gray-900 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <span className="font-black text-[#2563eb]">
                          R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    </div>

                  </div>
                ))
              )}
            </div>

            {/* Tax Calculation Breakdown Accordion */}
            <div className="px-6 py-2 bg-blue-50/50 border-t border-blue-100 text-xs">
              <button
                onClick={() => setShowTaxDetails(!showTaxDetails)}
                className="w-full flex items-center justify-between font-bold text-[#2563eb] text-[11px] cursor-pointer py-1"
              >
                <div className="flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>Impostos Calculados da Transação</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-black">R$ {(totalTaxST + totalIPI).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showTaxDetails ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {showTaxDetails && (
                <div className="pt-2 space-y-1.5 text-[10px] text-gray-600 border-t border-blue-200 mt-1">
                  <div className="flex justify-between">
                    <span>ICMS Operação Própria (18%):</span>
                    <span className="font-bold">Incluído</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ICMS-ST (Substituição Tributária):</span>
                    <span className="font-bold text-gray-900">R$ {totalTaxST.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IPI Destacado (5%):</span>
                    <span className="font-bold text-gray-900">R$ {totalIPI.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Summary & Actions */}
            <div className="p-6 bg-[#f5f6f6] border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between text-sm font-black text-gray-900">
                <span>Subtotal dos Produtos</span>
                <span className="text-[#2563eb] text-base">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                <ShieldCheck className="w-4 h-4 text-[#16a34a]" />
                <span>Frete grátis para todos os produtos elegíveis</span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setIsProposalOpen(true)}
                  className="bg-white hover:bg-blue-50 text-[#2563eb] border border-blue-300 py-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
                >
                  <FileText className="w-4 h-4" />
                  <span>Proposta PDF</span>
                </button>

                <Link
                  href="/checkout"
                  onClick={onClose}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-3 rounded-full text-xs font-bold text-center flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Commercial Proposal PDF Modal */}
      <CommercialProposalModal
        isOpen={isProposalOpen}
        onClose={() => setIsProposalOpen(false)}
        items={items}
        subtotal={subtotal}
      />
    </>
  );
}
