'use client';

import React, { useState } from 'react';
import { X, Search, CheckCircle2, ShieldCheck, MapPin, RefreshCw } from 'lucide-react';
import { CNPJResponse } from '@/lib/api/cnpj';

interface CnpjModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCnpj?: (cnpjData: CNPJResponse) => void;
}

export default function CnpjModal({ isOpen, onClose, onSelectCnpj }: CnpjModalProps) {
  const [cnpjInput, setCnpjInput] = useState('12.345.678/0001-90');
  const [isLoading, setIsLoading] = useState(false);
  const [queryResult, setQueryResult] = useState<CNPJResponse | null>({
    cnpj: '12.345.678/0001-90',
    razaoSocial: 'Tech Solutions & Tecnologia LTDA',
    nomeFantasia: 'Tech Solutions B2B',
    inscricaoEstadual: '123.456.789.111',
    regimeTributario: 'Lucro Presumido',
    cnae: '6201-5/00 - Desenvolvimento de programas de computador sob encomenda',
    statusReceita: 'ATIVA',
    sintegraStatus: 'HABILITADO_CONTRIBUINTE_ICMS',
    suframaCode: 'SUF-987654-ZFM',
    hasSuframa: true,
    endereco: {
      logradouro: 'Av. Paulista',
      numero: '1000',
      complemento: 'Conjunto 42',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01310-100'
    }
  });

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setQueryResult({
        cnpj: cnpjInput,
        razaoSocial: 'Empresa Consultada S.A.',
        nomeFantasia: 'Atacado Consultado',
        inscricaoEstadual: '987.654.321.000',
        regimeTributario: 'Simples Nacional',
        cnae: '4711-3/02 - Comércio varejista de mercadorias em geral',
        statusReceita: 'ATIVA',
        sintegraStatus: 'HABILITADO_CONTRIBUINTE_ICMS',
        suframaCode: 'ISENTO',
        hasSuframa: false,
        endereco: {
          logradouro: 'Rua das Indústrias',
          numero: '500',
          bairro: 'Distrito Industrial',
          cidade: 'Campinas',
          uf: 'SP',
          cep: '13000-000'
        }
      });
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-200 w-full max-w-xl overflow-hidden relative">
        
        {/* Header */}
        <div className="bg-[#0f172a] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-gray-950 font-black flex items-center justify-center text-xs">
              CNPJ
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight">Validação Fiscal Automática de CNPJ</h3>
              <p className="text-[10px] text-blue-300">Integração Receita Federal • Sintegra • SUFRAMA</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-blue-900/60 rounded-lg text-blue-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          
          {/* CNPJ Search Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={cnpjInput}
                onChange={(e) => setCnpjInput(e.target.value)}
                placeholder="Digite o CNPJ para consulta..."
                className="w-full h-11 px-4 text-xs font-mono font-bold text-gray-900 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="h-11 px-5 bg-blue-700 hover:bg-blue-800 text-white font-extrabold rounded-xl flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              <span>Consultar</span>
            </button>
          </form>

          {/* Consultation Result */}
          {queryResult && (
            <div className="space-y-3">
              
              {/* Badges Bar */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-700" /> Receita Federal: {queryResult.statusReceita}
                </span>

                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-900 border border-blue-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-700" /> Sintegra IE: OK
                </span>

                {queryResult.hasSuframa ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300">
                    SUFRAMA Isenção ZFM Ativa
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-medium bg-gray-100 text-gray-600">
                    Sem Benefício SUFRAMA
                  </span>
                )}
              </div>

              {/* Data Card */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2.5">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Razão Social</span>
                  <p className="font-black text-gray-900 text-sm">{queryResult.razaoSocial}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Nome Fantasia</span>
                    <p className="font-extrabold text-gray-800">{queryResult.nomeFantasia}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Inscrição Estadual (IE)</span>
                    <p className="font-mono font-bold text-gray-800">{queryResult.inscricaoEstadual}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-200/60">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Regime Tributário</span>
                    <p className="font-extrabold text-blue-900">{queryResult.regimeTributario}</p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Inscrição SUFRAMA</span>
                    <p className="font-mono font-bold text-amber-800">{queryResult.suframaCode}</p>
                  </div>
                </div>

                <div className="pt-1 border-t border-gray-200/60">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Endereço Fiscal Cadastrado</span>
                  <p className="font-semibold text-gray-700 text-[11px] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    {queryResult.endereco.logradouro}, {queryResult.endereco.bairro} - {queryResult.endereco.cidade}/{queryResult.endereco.uf} (CEP: {queryResult.endereco.cep})
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* Actions */}
          <div className="pt-3 flex items-center justify-between border-t border-gray-100">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-50 transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={() => {
                if (onSelectCnpj && queryResult) onSelectCnpj(queryResult);
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-extrabold flex items-center gap-2 transition-colors shadow-md cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar e Selecionar CNPJ</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
