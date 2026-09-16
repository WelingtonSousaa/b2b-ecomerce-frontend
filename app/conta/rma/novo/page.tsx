'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { RotateCcw, ArrowLeft, Upload, Package } from 'lucide-react';
import CompanyPanelHeader from '@/components/layout/CompanyPanelHeader';
import { useToast } from '@/context/ToastContext';

type RmaReason = 'TRANSPORT_DAMAGE' | 'MANUFACTURING_DEFECT' | 'WRONG_ITEM' | 'WARRANTY_CLAIM';

export default function NovoRMAPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [orderNumber, setOrderNumber] = useState('');
  const [selectedSku, setSelectedSku] = useState('');
  const [lotNumber, setLotNumber] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<RmaReason>('TRANSPORT_DAMAGE');
  const [description, setDescription] = useState('');
  const [cdDestination, setCdDestination] = useState('cd-sp');
  const [formError, setFormError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !selectedSku || !lotNumber || quantity < 1 || !description) {
      setFormError('Preencha todos os campos obrigatórios corretamente.');
      return;
    }

    showToast('Solicitação de RMA/Devolução registrada com sucesso!', 'success');
    router.push('/conta/rma');
  };

  return (
    <div className="pb-20 font-sans">
      <CompanyPanelHeader 
        title="Solicitar Nova Devolução (RMA)" 
        subtitle="Abra um ticket para devolução, troca ou acionamento de garantia de lotes."
        actions={
          <Link href="/conta/rma" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm bg-white border border-gray-200 px-4 py-2 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>
        }
      />

      <div className="max-w-4xl mx-auto px-4 lg:px-12 mt-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border border-gray-100">
          
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">Detalhes da Devolução</h3>
              <p className="text-xs text-gray-400">Preencha os dados do lote que apresentou problemas.</p>
            </div>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100">
              {formError}
            </div>
          )}

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nº do Pedido Original *</label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="ex: PED-2026-9871"
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Motivo do RMA *</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value as RmaReason)}
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                >
                  <option value="TRANSPORT_DAMAGE">Avaria no Transporte</option>
                  <option value="MANUFACTURING_DEFECT">Defeito de Fabricação (DOA)</option>
                  <option value="WRONG_ITEM">Item Incorreto / Divergência</option>
                  <option value="WARRANTY_CLAIM">Acionamento de Garantia</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 sm:col-span-5">
                <label className="font-bold text-gray-700 block mb-1">SKU do Produto *</label>
                <input
                  type="text"
                  required
                  value={selectedSku}
                  onChange={(e) => setSelectedSku(e.target.value)}
                  placeholder="ex: DELL-R750-XS"
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
              <div className="col-span-8 sm:col-span-4">
                <label className="font-bold text-gray-700 block mb-1">Lote (Batch ID) *</label>
                <input
                  type="text"
                  required
                  value={lotNumber}
                  onChange={(e) => setLotNumber(e.target.value)}
                  placeholder="Lote rastreável"
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
              <div className="col-span-4 sm:col-span-3">
                <label className="font-bold text-gray-700 block mb-1">Qtd. *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Descrição do Problema *</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Descreva detalhadamente o problema encontrado nas unidades..."
                className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb] resize-none"
              />
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-800">Evidências (Fotos / Laudos)</h4>
                  <p className="text-[10px] text-gray-500">JPG, PNG, PDF até 5MB</p>
                </div>
              </div>
              <button type="button" className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                Anexar Arquivos
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Link
              href="/conta/rma"
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="bg-[#2563eb] text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-[#1d4ed8] transition-colors shadow-xs flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>Gerar Etiqueta de Postagem</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
