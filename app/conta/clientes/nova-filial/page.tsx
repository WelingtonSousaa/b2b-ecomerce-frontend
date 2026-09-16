'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, Search, ArrowLeft, Loader2 } from 'lucide-react';
import CompanyPanelHeader from '@/components/layout/CompanyPanelHeader';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';

export default function NovaFilialPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { company } = useAuth();

  const [cnpjInput, setCnpjInput] = useState('');
  const [nomeFilial, setNomeFilial] = useState('');
  const [ieInput, setIeInput] = useState('');
  const [cepInput, setCepInput] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [isSearchingCNPJ, setIsSearchingCNPJ] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSearchCNPJ = () => {
    if (cnpjInput.length < 14) {
      setFormError('Digite um CNPJ válido para buscar.');
      return;
    }
    setFormError('');
    setIsSearchingCNPJ(true);
    
    setTimeout(() => {
      setNomeFilial('Filial Automática LTDA');
      setIeInput('ISENTO');
      setCepInput('01001-000');
      setLogradouro('Praça da Sé');
      setNumero('S/N');
      setBairro('Sé');
      setCidade('São Paulo');
      setUf('SP');
      setIsSearchingCNPJ(false);
      showToast('Dados da filial recuperados da Receita Federal!', 'success');
    }, 1500);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cnpjInput || !nomeFilial || !cepInput) {
      setFormError('Preencha os campos obrigatórios.');
      return;
    }

    showToast('Nova filial cadastrada com sucesso!', 'success');
    router.push('/conta/clientes');
  };

  return (
    <div className="pb-20 font-sans">
      <CompanyPanelHeader 
        title="Cadastrar Nova Filial" 
        subtitle="Vincule um novo CNPJ corporativo para entregas e faturamento centralizado."
        actions={
          <Link href="/conta/clientes" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm bg-white border border-gray-200 px-4 py-2 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>
        }
      />

      <div className="max-w-3xl mx-auto px-4 lg:px-12 mt-8">
        <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border border-gray-100">
          
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#2563eb] flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">Dados Cadastrais</h3>
              <p className="text-xs text-gray-400">Puxe automaticamente pelo CNPJ</p>
            </div>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100">
              {formError}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="font-bold text-gray-700 block mb-1">CNPJ da Filial *</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  value={cnpjInput}
                  onChange={(e) => setCnpjInput(e.target.value)}
                  placeholder="00.000.000/0000-00"
                  className="flex-1 bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
                <button
                  type="button"
                  onClick={handleSearchCNPJ}
                  disabled={isSearchingCNPJ}
                  className="bg-[#2563eb] text-white font-bold px-4 py-2.5 rounded-xl hover:bg-[#1d4ed8] transition-colors flex items-center gap-1 shrink-0 cursor-pointer disabled:opacity-50"
                >
                  {isSearchingCNPJ ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>Puxar Dados</span>
                </button>
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Identificação da Filial / Apelido *</label>
              <input
                type="text"
                required
                value={nomeFilial}
                onChange={(e) => setNomeFilial(e.target.value)}
                placeholder="ex: Filial Curitiba / Depósito Sul"
                className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Inscrição Estadual</label>
                <input
                  type="text"
                  value={ieInput}
                  onChange={(e) => setIeInput(e.target.value)}
                  placeholder="ex: 123.456.789"
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">CEP *</label>
                <input
                  type="text"
                  required
                  value={cepInput}
                  onChange={(e) => setCepInput(e.target.value)}
                  placeholder="00000-000"
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-8 sm:col-span-9">
                <label className="font-bold text-gray-700 block mb-1">Endereço de Entrega *</label>
                <input
                  type="text"
                  required
                  value={logradouro}
                  onChange={(e) => setLogradouro(e.target.value)}
                  placeholder="Rua, Avenida..."
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
              <div className="col-span-4 sm:col-span-3">
                <label className="font-bold text-gray-700 block mb-1">Nº *</label>
                <input
                  type="text"
                  required
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="123"
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>

            <div className="grid grid-cols-12 gap-3">
              <div className="col-span-12 sm:col-span-5">
                <label className="font-bold text-gray-700 block mb-1">Bairro *</label>
                <input
                  type="text"
                  required
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
              <div className="col-span-8 sm:col-span-5">
                <label className="font-bold text-gray-700 block mb-1">Cidade *</label>
                <input
                  type="text"
                  required
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
              <div className="col-span-4 sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">UF *</label>
                <input
                  type="text"
                  required
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Link
              href="/conta/clientes"
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="bg-[#2563eb] text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-[#1d4ed8] transition-colors shadow-xs"
            >
              Vincular Filial
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
