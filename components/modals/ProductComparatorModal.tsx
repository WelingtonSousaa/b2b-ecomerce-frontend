'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  X,
  Scale,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Layers,
  FileCheck2
} from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import FormalQuotePdfModal from '@/components/modals/FormalQuotePdfModal';

export default function ProductComparatorModal() {
  const { compareItems, removeFromCompare, clearCompare, isCompareOpen, closeCompareModal } = useCompare();
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [quoteNumber] = useState(() => 'COMPARE-849201');

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCompareOpen) {
        closeCompareModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCompareOpen, closeCompareModal]);

  if (!isCompareOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 font-sans"
      onClick={closeCompareModal}
    >
      {/* Modal Card - Centered with smooth zoom-in & slide animation */}
      <div
        className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-5xl overflow-hidden relative max-h-[90vh] flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#004e38] text-white p-6 relative shrink-0 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#004e38] flex items-center justify-center shadow-inner">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black tracking-tight">Comparador Técnico B2B</h3>
                <span className="bg-emerald-800/80 text-emerald-100 text-[10px] font-black px-2.5 py-0.5 rounded-full border border-emerald-600/50">
                  {compareItems.length} de 4 selecionados
                </span>
              </div>
              <p className="text-xs text-emerald-100/90 mt-0.5">
                Comparação lado a lado de NCM, impostos estaduais, MOQ e escalas de desconto por lote
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {compareItems.length > 0 && (
              <button
                type="button"
                onClick={clearCompare}
                className="text-xs font-bold text-emerald-200 hover:text-white underline transition-colors cursor-pointer hidden sm:block"
              >
                Limpar Todos
              </button>
            )}
            <button
              type="button"
              onClick={closeCompareModal}
              aria-label="Fechar comparador"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Comparison Table */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {compareItems.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto">
                <Scale className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <p className="text-base font-extrabold text-gray-900">
                  Nenhum produto selecionado para comparação
                </p>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">
                  Navegue pelo catálogo e clique em <strong>&quot;+ Comparar Técnico&quot;</strong> para analisar especificações e preços em lote lado a lado.
                </p>
              </div>
              <div>
                <Link
                  href="/produtos"
                  onClick={closeCompareModal}
                  className="inline-flex items-center gap-1.5 bg-[#004e38] hover:bg-[#033627] text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow-xs"
                >
                  <span>Explorar Catálogo de Produtos</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-2xl shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80">
                    <th className="p-4 w-52 text-gray-500 font-extrabold uppercase text-[10px] tracking-wider border-r border-gray-200">
                      Especificação Técnica
                    </th>
                    {compareItems.map((prod) => (
                      <th
                        key={prod.id}
                        className="p-4 text-center min-w-[220px] border-r border-gray-200 last:border-r-0 relative bg-white"
                      >
                        <button
                          type="button"
                          onClick={() => removeFromCompare(prod.id)}
                          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remover produto da comparação"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                        <div className="space-y-2.5 pt-1">
                          <div className="w-24 h-24 bg-[#f5f6f6] rounded-2xl p-2 mx-auto relative flex items-center justify-center border border-gray-100 shadow-2xs">
                            <Image
                              src={(prod.images && prod.images[0]) || '/media/img1.jpeg'}
                              alt={prod.name}
                              fill
                              className="object-contain p-1.5"
                            />
                          </div>
                          <h4 className="font-extrabold text-gray-900 line-clamp-2 text-xs h-9">
                            {prod.name}
                          </h4>
                          <div className="text-base font-black text-[#004e38]">
                            R$ {prod.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {/* Row 1: SKU & EAN */}
                  <tr className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-gray-700 bg-gray-50/50 border-r border-gray-200">
                      Código SKU / EAN
                    </td>
                    {compareItems.map((p) => (
                      <td
                        key={p.id}
                        className="p-3.5 text-center font-mono font-bold text-gray-900 border-r border-gray-200 last:border-r-0"
                      >
                        {p.sku}
                      </td>
                    ))}
                  </tr>

                  {/* Row 2: NCM Tax Code */}
                  <tr className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-gray-700 bg-gray-50/50 border-r border-gray-200">
                      NCM (Classificação Fiscal)
                    </td>
                    {compareItems.map((p) => (
                      <td
                        key={p.id}
                        className="p-3.5 text-center font-mono text-gray-700 font-semibold border-r border-gray-200 last:border-r-0"
                      >
                        {p.ncm || '8518.30.00'}
                      </td>
                    ))}
                  </tr>

                  {/* Row 3: Fiscal Treatment */}
                  <tr className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-gray-700 bg-gray-50/50 border-r border-gray-200">
                      Tributação Estimada
                    </td>
                    {compareItems.map((p) => (
                      <td
                        key={p.id}
                        className="p-3.5 text-center text-[11px] font-semibold text-emerald-800 border-r border-gray-200 last:border-r-0"
                      >
                        <span className="inline-flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-[#004e38]" />
                          <span>ICMS SP 18% (Isento ST)</span>
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Row 4: Brand */}
                  <tr className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-gray-700 bg-gray-50/50 border-r border-gray-200">
                      Marca / Fabricante
                    </td>
                    {compareItems.map((p) => (
                      <td
                        key={p.id}
                        className="p-3.5 text-center font-bold text-gray-900 border-r border-gray-200 last:border-r-0"
                      >
                        {p.brand}
                      </td>
                    ))}
                  </tr>

                  {/* Row 5: MOQ */}
                  <tr className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-gray-700 bg-gray-50/50 border-r border-gray-200">
                      Lote Mínimo (MOQ)
                    </td>
                    {compareItems.map((p) => (
                      <td
                        key={p.id}
                        className="p-3.5 text-center font-bold text-[#004e38] border-r border-gray-200 last:border-r-0"
                      >
                        {p.moq} {p.uom}s
                      </td>
                    ))}
                  </tr>

                  {/* Row 6: Volume Discount */}
                  <tr className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-gray-700 bg-gray-50/50 border-r border-gray-200">
                      Maior Desconto por Lote
                    </td>
                    {compareItems.map((p) => {
                      const maxDiscount = p.volumeDiscounts.reduce(
                        (max, curr) => Math.max(max, curr.discountPercentage),
                        0
                      );
                      return (
                        <td
                          key={p.id}
                          className="p-3.5 text-center font-black text-emerald-700 border-r border-gray-200 last:border-r-0"
                        >
                          {maxDiscount > 0 ? `-${maxDiscount}% Off` : 'Preço Fixo'}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 7: Stock Available CD SP */}
                  <tr className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-3.5 font-bold text-gray-700 bg-gray-50/50 border-r border-gray-200">
                      Estoque CD São Paulo (SP)
                    </td>
                    {compareItems.map((p) => {
                      const spStock =
                        p.stockByCD.find((cd) => cd.cdId === 'cd-sp')?.availableQuantity || 0;
                      return (
                        <td
                          key={p.id}
                          className="p-3.5 text-center font-bold text-gray-900 border-r border-gray-200 last:border-r-0"
                        >
                          {spStock > 0 ? (
                            <span className="inline-flex items-center gap-1 text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {spStock} un prontas
                            </span>
                          ) : (
                            <span className="text-amber-600">⚠ Sob encomenda</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 8: Action */}
                  <tr className="bg-gray-50/50">
                    <td className="p-3.5 font-bold text-gray-700 border-r border-gray-200">
                      Ação Comercial
                    </td>
                    {compareItems.map((p) => (
                      <td
                        key={p.id}
                        className="p-3.5 text-center border-r border-gray-200 last:border-r-0"
                      >
                        <Link
                          href={`/produto/${p.sku}`}
                          onClick={closeCompareModal}
                          className="inline-flex items-center justify-center gap-1 w-full bg-[#004e38] hover:bg-[#033627] text-white font-bold text-[11px] py-2 px-3.5 rounded-full transition-all text-center cursor-pointer shadow-xs hover:scale-102"
                        >
                          <span>Ver Detalhes</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#f5f6f6] border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium pl-2">
            <Layers className="w-4 h-4 text-[#004e38]" />
            <span>Pressione <strong>ESC</strong> ou clique fora para fechar</span>
          </div>

          <div className="flex items-center gap-2">
            {compareItems.length > 0 && (
              <button
                type="button"
                onClick={() => setIsPdfModalOpen(true)}
                className="bg-emerald-50 hover:bg-emerald-100 text-[#004e38] border border-emerald-300 font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Gerar Cotação Formal (PDF / RFQ)</span>
              </button>
            )}

            <button
              type="button"
              onClick={closeCompareModal}
              className="bg-[#004e38] hover:bg-[#033627] text-white font-bold text-xs px-6 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>

      {/* Formal Quote PDF Modal */}
      <FormalQuotePdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        items={compareItems.map(p => ({ product: p, quantity: p.moq || 1 }))}
        customQuoteNumber={quoteNumber}
      />
    </div>
  );
}
