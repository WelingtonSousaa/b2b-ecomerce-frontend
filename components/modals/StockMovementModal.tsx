'use client';

import React, { useState } from 'react';
import {
  X,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { Product, StockMovement, StockMovementType, StockMovementReason, DEFAULT_DISTRIBUTION_CENTERS } from '@/types/b2b';

interface StockMovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  selectedProduct?: Product | null;
  onConfirmMovement: (movement: StockMovement) => void;
}

export default function StockMovementModal({
  isOpen,
  onClose,
  products,
  selectedProduct,
  onConfirmMovement,
}: StockMovementModalProps) {
  const initialProductId = selectedProduct?.id || products[0]?.id || '';
  const initialVariantId = selectedProduct?.hasVariants && selectedProduct?.variants && selectedProduct.variants.length > 0
    ? selectedProduct.variants[0].id
    : '';

  const [selectedProductId, setSelectedProductId] = useState<string>(initialProductId);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(initialVariantId);
  const [selectedCdId, setSelectedCdId] = useState<string>('cd-sp');
  const [movementType, setMovementType] = useState<StockMovementType>('IN');
  const [reason, setReason] = useState<StockMovementReason>('PURCHASE_INVOICE');
  const [quantity, setQuantity] = useState<number>(10);
  const [fiscalDoc, setFiscalDoc] = useState<string>('NF-e 00');
  const [batchNumber, setBatchNumber] = useState<string>('LOT-2026');
  const [notes, setNotes] = useState<string>('');
  const [operator, setOperator] = useState<string>('Operador Logístico B2B');
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentProduct = products.find(p => p.id === selectedProductId) || products[0];
  const currentVariant = currentProduct?.hasVariants && currentProduct?.variants
    ? currentProduct.variants.find(v => v.id === selectedVariantId) || currentProduct.variants[0]
    : null;

  // Calculate current stock in chosen CD
  const stockByCdArray = currentVariant ? currentVariant.stockByCD : currentProduct?.stockByCD || [];
  const currentCdStock = stockByCdArray.find(c => c.cdId === selectedCdId)?.availableQuantity || 0;
  
  // Calculate resulting stock
  const qtyNumber = Number(quantity) || 0;
  const resultingStock = movementType === 'IN' ? currentCdStock + qtyNumber : Math.max(0, currentCdStock - qtyNumber);
  const isNegativeWarning = movementType === 'OUT' && qtyNumber > currentCdStock;

  const handleProductChange = (prodId: string) => {
    setSelectedProductId(prodId);
    const prod = products.find(p => p.id === prodId);
    if (prod?.hasVariants && prod.variants && prod.variants.length > 0) {
      setSelectedVariantId(prod.variants[0].id);
    } else {
      setSelectedVariantId('');
    }
  };

  const getReasonLabel = (r: StockMovementReason): string => {
    switch (r) {
      case 'PURCHASE_INVOICE': return 'Compra / NF de Entrada (Fornecedor)';
      case 'RETURN': return 'Devolução de Cliente (RMA)';
      case 'SUPPLIER_RESTOCK': return 'Reposição Direta de Fábrica';
      case 'INVENTORY_ADJUSTMENT_IN': return 'Ajuste de Inventário (Sobra/Contagem)';
      case 'DAMAGE_LOSS': return 'Avaria / Quebra / Perda';
      case 'DIRECT_SALE': return 'Venda Balcão / Canal Externo';
      case 'SAMPLE_BONUS': return 'Bonificação / Amostra Comercial';
      case 'EXPIRATION': return 'Validade Vencida / Descarte';
      case 'INVENTORY_ADJUSTMENT_OUT': return 'Ajuste de Inventário (Falta/Contagem)';
      default: return 'Outro Motivo';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct || qtyNumber <= 0) return;

    const cdInfo = DEFAULT_DISTRIBUTION_CENTERS.find(c => c.id === selectedCdId);

    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      productId: currentProduct.id,
      productName: currentProduct.name,
      sku: currentVariant ? currentVariant.sku : currentProduct.sku,
      variantInfo: currentVariant
        ? Object.entries(currentVariant.combination).map(([k, v]) => `${k}: ${v}`).join(' | ')
        : undefined,
      cdId: selectedCdId,
      cdName: cdInfo ? cdInfo.name : selectedCdId,
      type: movementType,
      reason,
      reasonLabel: getReasonLabel(reason),
      quantity: qtyNumber,
      previousStock: currentCdStock,
      resultingStock,
      fiscalDoc: fiscalDoc.trim() || undefined,
      batchNumber: batchNumber.trim() || undefined,
      timestamp: new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }),
      operator,
      notes: notes.trim() || undefined,
    };

    setShowSuccess(true);
    setTimeout(() => {
      onConfirmMovement(movement);
      setShowSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#004e38] text-white p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              {movementType === 'IN' ? (
                <ArrowUpRight className="w-5 h-5 text-emerald-300" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-amber-300" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-black tracking-tight">Movimentação Manual de Estoque</h3>
              <p className="text-xs text-emerald-100">
                Ajuste de entrada (reposição/compra) ou saída (avaria/baixa/amostra) com auditoria instantânea.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          
          {showSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-[#004e38] p-3 rounded-2xl flex items-center gap-2 font-bold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Estoque atualizado com sucesso e registrado no histórico Kardex!</span>
            </div>
          )}

          {/* Toggle Type: Entrada (+) vs Saída (-) */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-gray-700 uppercase tracking-wider text-[11px] block">
              Tipo de Movimentação
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMovementType('IN');
                  setReason('PURCHASE_INVOICE');
                }}
                className={`py-3 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                  movementType === 'IN'
                    ? 'bg-emerald-50/80 border-[#004e38] text-[#004e38] shadow-xs'
                    : 'bg-[#f5f6f6] border-transparent text-gray-500 hover:bg-gray-200/60'
                }`}
              >
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                <span>🟢 Entrada de Estoque (+)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMovementType('OUT');
                  setReason('DAMAGE_LOSS');
                }}
                className={`py-3 px-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                  movementType === 'OUT'
                    ? 'bg-red-50/80 border-red-600 text-red-700 shadow-xs'
                    : 'bg-[#f5f6f6] border-transparent text-gray-500 hover:bg-gray-200/60'
                }`}
              >
                <ArrowDownRight className="w-4 h-4 text-red-600" />
                <span>🔴 Saída / Baixa Manual (-)</span>
              </button>
            </div>
          </div>

          {/* Seleção do Produto & Grade */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-extrabold text-gray-700 uppercase tracking-wider text-[11px] block">
                Produto Alvo
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-3 py-2.5 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004e38]"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-extrabold text-gray-700 uppercase tracking-wider text-[11px] block">
                Centro de Distribuição (CD)
              </label>
              <select
                value={selectedCdId}
                onChange={(e) => setSelectedCdId(e.target.value)}
                className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-3 py-2.5 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004e38]"
              >
                <option value="cd-sp">CD Sudeste - São Paulo (SP)</option>
                <option value="cd-sc">CD Sul - Joinville (SC)</option>
                <option value="cd-ba">CD Nordeste - Camaçari (BA)</option>
              </select>
            </div>
          </div>

          {/* Se o produto tem variantes, exibir seleção de variação */}
          {currentProduct?.hasVariants && currentProduct.variants && currentProduct.variants.length > 0 && (
            <div className="space-y-1.5 bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200/80">
              <label className="font-extrabold text-[#004e38] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                Selecione a Variação / Grade do Produto:
              </label>
              <select
                value={selectedVariantId}
                onChange={(e) => setSelectedVariantId(e.target.value)}
                className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-2 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004e38]"
              >
                {currentProduct.variants.map(v => (
                  <option key={v.id} value={v.id}>
                    {Object.entries(v.combination).map(([k, val]) => `${k}: ${val}`).join(' | ')} — SKU: {v.sku} (EAN: {v.ean})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Motivo da Operação */}
          <div className="space-y-1.5">
            <label className="font-extrabold text-gray-700 uppercase tracking-wider text-[11px] block">
              Motivo / Justificativa da Movimentação
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value as StockMovementReason)}
              className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-3 py-2.5 font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004e38]"
            >
              {movementType === 'IN' ? (
                <>
                  <option value="PURCHASE_INVOICE">Compra / NF de Entrada de Fornecedor</option>
                  <option value="SUPPLIER_RESTOCK">Reposição Direta de Fábrica / Transferência</option>
                  <option value="RETURN">Devolução de Mercadoria por Cliente (RMA)</option>
                  <option value="INVENTORY_ADJUSTMENT_IN">Ajuste de Inventário Físico (Sobra de Contagem)</option>
                </>
              ) : (
                <>
                  <option value="DAMAGE_LOSS">Avaria / Quebra / Perda no Armazém ou Transporte</option>
                  <option value="DIRECT_SALE">Saída por Venda Física / Canal Balcão Externo</option>
                  <option value="SAMPLE_BONUS">Bonificação Comercial / Amostra Grátis para Teste B2B</option>
                  <option value="EXPIRATION">Data de Validade Expirada / Descarte Técnico</option>
                  <option value="INVENTORY_ADJUSTMENT_OUT">Ajuste de Inventário Físico (Falta na Contagem)</option>
                </>
              )}
            </select>
          </div>

          {/* Live Counter Box: Saldo Atual -> Movimento -> Saldo Resultante */}
          <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-gray-700 text-[11px] uppercase">Cálculo de Saldo em Tempo Real:</span>
              <span className="text-[10px] text-gray-500 font-mono">
                {currentVariant ? currentVariant.sku : currentProduct?.sku}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center items-center">
              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Estoque Atual</span>
                <span className="text-lg font-black text-gray-800">{currentCdStock} un</span>
              </div>

              <div className={`p-3 rounded-xl border font-black text-sm flex flex-col items-center justify-center ${
                movementType === 'IN' ? 'bg-emerald-50 border-emerald-200 text-[#004e38]' : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                <span className="text-[10px] uppercase font-bold">
                  {movementType === 'IN' ? '+ Entrada' : '- Saída'}
                </span>
                <span className="text-lg font-black">
                  {movementType === 'IN' ? `+${qtyNumber}` : `-${qtyNumber}`}
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-2xs">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">Novo Saldo</span>
                <span className={`text-lg font-black ${resultingStock < 10 ? 'text-amber-600' : 'text-emerald-700'}`}>
                  {resultingStock} un
                </span>
              </div>
            </div>

            {isNegativeWarning && (
              <div className="bg-amber-50 border border-amber-300 text-amber-900 p-2.5 rounded-xl flex items-center gap-2 text-[11px] font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Aviso: A quantidade a retirar é maior que o estoque atual disponível neste CD! O saldo ficará zerado.</span>
              </div>
            )}
          </div>

          {/* Quantidade, Documento Fiscal e Lote */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-gray-700 text-[11px]">Quantidade (Unidades)</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-3 py-2 font-black text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#004e38]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700 text-[11px]">NF-e / Laudo / Doc</label>
              <input
                type="text"
                value={fiscalDoc}
                onChange={(e) => setFiscalDoc(e.target.value)}
                placeholder="Ex: NF-e 004921"
                className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-3 py-2 font-mono text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#004e38]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700 text-[11px]">Lote Físico</label>
              <input
                type="text"
                value={batchNumber}
                onChange={(e) => setBatchNumber(e.target.value)}
                placeholder="Ex: LOT-2026-08A"
                className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-3 py-2 font-mono text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#004e38]"
              />
            </div>
          </div>

          {/* Observações & Responsável */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-bold text-gray-700 text-[11px]">Responsável / Operador</label>
              <input
                type="text"
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#004e38]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700 text-[11px]">Observações Adicionais</label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Motivo detalhado para auditoria..."
                className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-3 py-2 text-gray-900 text-xs focus:outline-none focus:ring-2 focus:ring-[#004e38]"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className={`px-6 py-2.5 rounded-full font-black text-white shadow-sm flex items-center gap-2 cursor-pointer transition-all ${
                movementType === 'IN'
                  ? 'bg-[#004e38] hover:bg-[#033627]'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {movementType === 'IN' ? (
                <>
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Confirmar Entrada (+{qtyNumber})</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="w-4 h-4" />
                  <span>Confirmar Saída (-{qtyNumber})</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
