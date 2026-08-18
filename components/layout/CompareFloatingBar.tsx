'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Scale, X, ArrowRight, Sparkles } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';

export default function CompareFloatingBar() {
  const { compareItems, removeFromCompare, clearCompare, openCompareModal } = useCompare();
  const [isHovered, setIsHovered] = useState(false);

  const itemCount = compareItems.length;

  return (
    <div
      className="fixed bottom-6 right-6 z-40 font-sans flex flex-col items-end select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating Preview Card on Hover (when items are selected) */}
      {isHovered && itemCount > 0 && (
        <div className="mb-3 bg-white text-gray-900 rounded-3xl p-4 shadow-2xl border border-gray-100 w-80 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-3">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="font-extrabold text-xs text-gray-900">
                Produtos em Comparação
              </span>
            </div>
            <span className="bg-emerald-100 text-[#004e38] text-[10px] font-black px-2 py-0.5 rounded-full">
              {itemCount}/4
            </span>
          </div>

          {/* Miniature Product List */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {compareItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 p-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100/80 transition-colors"
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="w-9 h-9 rounded-lg bg-white p-1 shrink-0 relative border border-gray-200">
                    <Image
                      src={(item.images && item.images[0]) || '/media/img1.jpeg'}
                      alt={item.name}
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <div className="overflow-hidden text-left">
                    <p className="text-[11px] font-bold text-gray-900 truncate">
                      {item.name}
                    </p>
                    <p className="text-[10px] font-mono text-[#004e38] font-bold">
                      R$ {item.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromCompare(item.id);
                  }}
                  className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                  title="Remover"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                clearCompare();
              }}
              className="text-[11px] font-bold text-gray-400 hover:text-red-600 transition-colors underline cursor-pointer"
            >
              Limpar lista
            </button>

            <button
              type="button"
              onClick={openCompareModal}
              className="bg-[#004e38] hover:bg-[#033627] text-white text-xs font-bold px-3.5 py-1.5 rounded-full flex items-center gap-1 transition-all shadow-xs cursor-pointer"
            >
              <span>Abrir Tabela</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Chat-Style Bubble Button on the Right */}
      <button
        type="button"
        onClick={openCompareModal}
        aria-label="Abrir Comparador Técnico B2B"
        className="group relative flex items-center gap-3 bg-[#004e38] hover:bg-[#033627] text-white p-3.5 sm:px-4 sm:py-3.5 rounded-full shadow-2xl hover:shadow-[#004e38]/40 border-2 border-emerald-400/40 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
      >
        {/* Pulsing ring indicator if items exist */}
        {itemCount > 0 && (
          <span className="absolute -inset-0.5 rounded-full bg-emerald-400 opacity-30 animate-ping pointer-events-none" />
        )}

        <div className="relative flex items-center justify-center">
          <Scale className="w-6 h-6 text-white transition-transform group-hover:rotate-12 duration-300" />
          
          {/* Badge Counter */}
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-400 text-gray-950 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#004e38] shadow-xs">
              {itemCount}
            </span>
          )}
        </div>

        {/* Text Pill (visible on desktop or on hover) */}
        <div className="hidden sm:flex flex-col text-left pr-1">
          <span className="text-[11px] font-black leading-tight tracking-tight">
            Comparador B2B
          </span>
          <span className="text-[9px] text-emerald-200 font-medium">
            {itemCount > 0 ? `${itemCount} produto${itemCount > 1 ? 's' : ''} selecionado${itemCount > 1 ? 's' : ''}` : 'Comparar especificações'}
          </span>
        </div>
      </button>
    </div>
  );
}
