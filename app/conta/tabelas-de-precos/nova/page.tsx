'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Tag, ArrowLeft, Users, MapPin } from 'lucide-react';
import CompanyPanelHeader from '@/components/layout/CompanyPanelHeader';
import { useToast } from '@/context/ToastContext';

export default function NovaTabelaPrecoPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCnpjs, setNewCnpjs] = useState('');
  const [newRegions, setNewRegions] = useState('');
  const [formError, setFormError] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newCode) {
      setFormError('Preencha os campos obrigatórios (Nome e Código).');
      return;
    }

    showToast('Tabela de preços corporativa criada com sucesso!', 'success');
    router.push('/conta/tabelas-de-precos');
  };

  return (
    <div className="pb-20 font-sans">
      <CompanyPanelHeader 
        title="Criar Tabela de Preços (B2B)" 
        subtitle="Configure tabelas personalizadas para CNPJs ou regiões específicas."
        actions={
          <Link href="/conta/tabelas-de-precos" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm bg-white border border-gray-200 px-4 py-2 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>
        }
      />

      <div className="max-w-3xl mx-auto px-4 lg:px-12 mt-8">
        <form onSubmit={handleCreate} className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border border-gray-100">
          
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#2563eb] flex items-center justify-center font-bold">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">Configurações da Tabela</h3>
              <p className="text-xs text-gray-400">Defina os parâmetros básicos de precificação.</p>
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
                <label className="font-bold text-gray-700 block mb-1">Código Identificador (ID) *</label>
                <input
                  type="text"
                  required
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value.toUpperCase())}
                  placeholder="ex: TAB-SP-ATACADO"
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nome da Tabela *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="ex: Preços Varejo São Paulo 2026"
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Descrição Comercial</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={2}
                placeholder="Descreva a finalidade desta tabela..."
                className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb] resize-none"
              />
            </div>

            <div className="border border-gray-200 rounded-2xl p-5 space-y-4">
              <h4 className="text-sm font-black text-gray-900">Restrições de Visualização (Opcional)</h4>
              
              <div>
                <label className="font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-blue-500" /> Atribuir a CNPJs específicos
                </label>
                <input
                  type="text"
                  value={newCnpjs}
                  onChange={(e) => setNewCnpjs(e.target.value)}
                  placeholder="Separe os CNPJs por vírgula..."
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-amber-500" /> Atribuir a Regiões (UF)
                </label>
                <input
                  type="text"
                  value={newRegions}
                  onChange={(e) => setNewRegions(e.target.value.toUpperCase())}
                  placeholder="Ex: SP, RJ, MG"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Link
              href="/conta/tabelas-de-precos"
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="bg-[#2563eb] text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-[#1d4ed8] transition-colors shadow-xs"
            >
              Criar Tabela
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
