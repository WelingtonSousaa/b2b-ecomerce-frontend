'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  X,
  Building2,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Save,
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function EditCompanyModal() {
  const { company, isEditCompanyModalOpen, closeEditCompanyModal, updateCompany } = useAuth();

  const [nomeFantasia, setNomeFantasia] = useState(company?.nomeFantasia || 'Tech Solutions LTDA');
  const [razaoSocial, setRazaoSocial] = useState(company?.razaoSocial || 'Tech Solutions & Tecnologia S.A.');
  const [cnpj, setCnpj] = useState(company?.cnpj || '12.345.678/0001-90');
  const [inscricaoEstadual, setInscricaoEstadual] = useState(company?.inscricaoEstadual || '123.456.789.111');
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState(company?.inscricaoMunicipal || '');
  const [regimeTributario, setRegimeTributario] = useState<'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL'>(
    company?.regimeTributario || 'LUCRO_PRESUMIDO'
  );
  const [suframaCode, setSuframaCode] = useState(company?.suframaCode || '');
  const [industrySegment, setIndustrySegment] = useState(company?.industrySegment || 'Tecnologia & Equipamentos');
  const [logoUrl, setLogoUrl] = useState(company?.logoUrl || '');

  // Endereço
  const [cep, setCep] = useState(company?.mainAddress?.cep || '01310-100');
  const [logradouro, setLogradouro] = useState(company?.mainAddress?.logradouro || 'Av. Paulista');
  const [numero, setNumero] = useState(company?.mainAddress?.numero || '1000');
  const [complemento, setComplemento] = useState(company?.mainAddress?.complemento || '');
  const [bairro, setBairro] = useState(company?.mainAddress?.bairro || 'Bela Vista');
  const [cidade, setCidade] = useState(company?.mainAddress?.cidade || 'São Paulo');
  const [uf, setUf] = useState(company?.mainAddress?.uf || 'SP');

  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  if (!isEditCompanyModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateCompany({
      nomeFantasia,
      razaoSocial,
      cnpj,
      inscricaoEstadual,
      inscricaoMunicipal,
      regimeTributario,
      suframaCode,
      industrySegment,
      logoUrl,
      mainAddress: {
        cep,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        uf,
        pais: 'Brasil',
      },
    });

    setIsSavedSuccess(true);
    setTimeout(() => {
      setIsSavedSuccess(false);
      closeEditCompanyModal();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden relative max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-[#004e38] text-white p-6 relative shrink-0">
          <button
            onClick={closeEditCompanyModal}
            className="absolute top-5 right-5 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 text-amber-400 flex items-center justify-center font-black">
              <Building2 className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold tracking-tight">Editar Perfil & Identidade da Empresa</h3>
              <p className="text-xs text-emerald-100 mt-0.5">
                Atualize a marca, razão social, dados fiscais e endereço cadastrados na plataforma.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          
          {/* Section 1: Marca & Identidade Visual */}
          <div className="space-y-3 border-b border-gray-100 pb-5">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#004e38]" />
              <h4 className="text-sm font-bold text-gray-900">Identidade Visual & Logotipo</h4>
            </div>

            <div className="flex items-center gap-4 bg-[#f5f6f6] p-4 rounded-2xl border border-gray-200">
              {/* Logo Preview */}
              <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 flex items-center justify-center text-gray-400 shrink-0 overflow-hidden relative shadow-2xs">
                {logoUrl ? (
                  <Image src={logoUrl} alt="Logo da Empresa" fill className="object-contain p-2" />
                ) : (
                  <Building2 className="w-8 h-8 text-[#004e38]" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <label className="font-bold text-gray-700 block">URL da Marca / Logotipo da Empresa</label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://suaempresa.com.br/logo.png"
                  className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                />
                <p className="text-[10px] text-gray-400">
                  O logotipo será exibido na barra de navegação, relatórios e cotações da plataforma.
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Dados Corporativos Fiscais */}
          <div className="space-y-4 border-b border-gray-100 pb-5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#004e38]" />
              <h4 className="text-sm font-bold text-gray-900">Dados Fiscais & Cadastro (CNPJ)</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nome Fantasia</label>
                <input
                  type="text"
                  required
                  value={nomeFantasia}
                  onChange={(e) => setNomeFantasia(e.target.value)}
                  className="w-full bg-[#f5f6f6] rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Razão Social (Receita Federal)</label>
                <input
                  type="text"
                  required
                  value={razaoSocial}
                  onChange={(e) => setRazaoSocial(e.target.value)}
                  className="w-full bg-[#f5f6f6] rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">CNPJ da Matriz</label>
                <input
                  type="text"
                  required
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  className="w-full bg-[#f5f6f6] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Inscrição Estadual (IE)</label>
                <input
                  type="text"
                  value={inscricaoEstadual}
                  onChange={(e) => setInscricaoEstadual(e.target.value)}
                  className="w-full bg-[#f5f6f6] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Inscrição Municipal</label>
                <input
                  type="text"
                  value={inscricaoMunicipal}
                  onChange={(e) => setInscricaoMunicipal(e.target.value)}
                  placeholder="ex: 9876543"
                  className="w-full bg-[#f5f6f6] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Regime Tributário</label>
                <select
                  value={regimeTributario}
                  onChange={(e) => setRegimeTributario(e.target.value as 'SIMPLES_NACIONAL' | 'LUCRO_PRESUMIDO' | 'LUCRO_REAL')}
                  className="w-full bg-[#f5f6f6] rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:outline-none"
                >
                  <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
                  <option value="LUCRO_REAL">Lucro Real</option>
                  <option value="SIMPLES_NACIONAL">Simples Nacional</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Segmento Industrial</label>
                <input
                  type="text"
                  value={industrySegment}
                  onChange={(e) => setIndustrySegment(e.target.value)}
                  placeholder="ex: Tecnologia & Equipamentos"
                  className="w-full bg-[#f5f6f6] rounded-xl px-3.5 py-2.5 text-xs font-semibold text-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Código SUFRAMA (ZFM)</label>
                <input
                  type="text"
                  value={suframaCode}
                  onChange={(e) => setSuframaCode(e.target.value)}
                  placeholder="SUF-000000"
                  className="w-full bg-[#f5f6f6] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Endereço Fiscal */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#004e38]" />
              <h4 className="text-sm font-bold text-gray-900">Endereço Fiscal Principal</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">CEP</label>
                <input
                  type="text"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className="w-full bg-[#f5f6f6] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-gray-900 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-bold text-gray-700 block mb-1">Logradouro / Endereço</label>
                <input
                  type="text"
                  value={logradouro}
                  onChange={(e) => setLogradouro(e.target.value)}
                  className="w-full bg-[#f5f6f6] rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Número</label>
                <input
                  type="text"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  className="w-full bg-[#f5f6f6] rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="sm:col-span-1">
                <label className="font-bold text-gray-700 block mb-1">Complemento</label>
                <input
                  type="text"
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                  placeholder="ex: Sala 42"
                  className="w-full bg-[#f5f6f6] rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Bairro</label>
                <input
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="w-full bg-[#f5f6f6] rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Cidade</label>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full bg-[#f5f6f6] rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Estado (UF)</label>
                <input
                  type="text"
                  value={uf}
                  onChange={(e) => setUf(e.target.value)}
                  className="w-full bg-[#f5f6f6] rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Form Action Controls */}
          <div className="pt-4 flex items-center justify-between border-t border-gray-100">
            <button
              type="button"
              onClick={closeEditCompanyModal}
              className="px-5 py-3 rounded-full border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="bg-[#004e38] hover:bg-[#033627] text-white font-bold px-8 py-3.5 rounded-full transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              {isSavedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>Salvo com Sucesso!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Informações da Empresa</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
