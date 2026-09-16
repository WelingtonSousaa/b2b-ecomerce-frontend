'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  Search,
  ArrowRight,
  RefreshCw,
  Sparkles,
  ArrowLeft,
  CreditCard,
  Building2,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  FileText,
  Phone,
  Mail,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { fetchCNPJData, CNPJResponse } from '@/lib/api/cnpj';
import { useAuth } from '@/context/AuthContext';

export default function CadastroPage() {
  const { register } = useAuth();

  // Modo de Entrada: Automático via CNPJ ou Manual
  const [fillMode, setFillMode] = useState<'AUTO_CNPJ' | 'MANUAL'>('AUTO_CNPJ');

  // Controle de Etapas: 1. Dados da Empresa | 2. Acesso & Responsável | 3. Concluído
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // ==========================================
  // ESTADO: DADOS DA EMPRESA (FISCAIS & ENDEREÇO)
  // ==========================================
  const [cnpj, setCnpj] = useState('');
  const [razaoSocial, setRazaoSocial] = useState('');
  const [nomeFantasia, setNomeFantasia] = useState('');
  const [industrySegment, setIndustrySegment] = useState('Tecnologia & Informática');
  const [inscricaoEstadual, setInscricaoEstadual] = useState('');
  const [isentoIE, setIsentoIE] = useState(false);
  const [inscricaoMunicipal, setInscricaoMunicipal] = useState('');
  const [regimeTributario, setRegimeTributario] = useState<'LUCRO_PRESUMIDO' | 'LUCRO_REAL' | 'SIMPLES_NACIONAL'>('LUCRO_PRESUMIDO');
  const [cnaePrincipal, setCnaePrincipal] = useState('');
  const [hasSuframa, setHasSuframa] = useState(false);
  const [suframaCode, setSuframaCode] = useState('');

  // Endereço
  const [cep, setCep] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('SP');

  // Estado de Consulta CNPJ
  const [isSearchingCNPJ, setIsSearchingCNPJ] = useState(false);
  const [cnpjError, setCnpjError] = useState('');
  const [isCNPJValidated, setIsCNPJValidated] = useState(false);

  // ==========================================
  // ESTADO: DADOS CRUCIAIS DO USUÁRIO & ACESSO
  // ==========================================
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userRole, setUserRole] = useState<'BUYER' | 'APPROVER' | 'ADMIN'>('BUYER');
  const [department, setDepartment] = useState('Compras & Suprimentos');

  // Senha e Segurança
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [requestedCreditLimit, setRequestedCreditLimit] = useState('50000');
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Estados de Envio
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formata CNPJ enquanto digita
  const handleCNPJChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 14);
    let formatted = raw;
    if (raw.length > 12) {
      formatted = raw.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2})$/, '$1.$2.$3/$4-$5');
    } else if (raw.length > 8) {
      formatted = raw.replace(/^(\d{2})(\d{3})(\d{3})(\d{1,4})$/, '$1.$2.$3/$4');
    } else if (raw.length > 5) {
      formatted = raw.replace(/^(\d{2})(\d{3})(\d{1,3})$/, '$1.$2.$3');
    } else if (raw.length > 2) {
      formatted = raw.replace(/^(\d{2})(\d{1,3})$/, '$1.$2');
    }
    setCnpj(formatted);
    setIsCNPJValidated(false);
  };

  // Formata CEP enquanto digita
  const handleCEPChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 8);
    const formatted = raw.length > 5 ? raw.replace(/^(\d{5})(\d{1,3})$/, '$1-$2') : raw;
    setCep(formatted);
  };

  // Formata Telefone enquanto digita
  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    let formatted = raw;
    if (raw.length > 10) {
      formatted = raw.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (raw.length > 6) {
      formatted = raw.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (raw.length > 2) {
      formatted = raw.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
    }
    setUserPhone(formatted);
  };

  // Busca de CNPJ Oficial na Receita Federal via BrasilAPI
  const handleSearchCNPJ = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCnpjError('');

    const cleanCnpj = cnpj.replace(/\D/g, '');
    if (cleanCnpj.length !== 14) {
      setCnpjError('O CNPJ deve conter exatamente 14 dígitos numéricos.');
      return;
    }

    setIsSearchingCNPJ(true);
    try {
      const data: CNPJResponse = await fetchCNPJData(cleanCnpj);

      setRazaoSocial(data.razaoSocial || '');
      setNomeFantasia(data.nomeFantasia || data.razaoSocial || '');
      setInscricaoEstadual(data.inscricaoEstadual || '');
      setIsentoIE(!data.inscricaoEstadual);
      setCnaePrincipal(data.cnae || '');
      
      if (data.regimeTributario === 'Simples Nacional') {
        setRegimeTributario('SIMPLES_NACIONAL');
      } else if (data.regimeTributario === 'Lucro Real') {
        setRegimeTributario('LUCRO_REAL');
      } else {
        setRegimeTributario('LUCRO_PRESUMIDO');
      }

      if (data.hasSuframa) {
        setHasSuframa(true);
        setSuframaCode(data.suframaCode || '');
      }

      if (data.endereco) {
        setLogradouro(data.endereco.logradouro || '');
        setNumero(data.endereco.numero || '');
        setComplemento(data.endereco.complemento || '');
        setBairro(data.endereco.bairro || '');
        setCidade(data.endereco.cidade || '');
        setUf(data.endereco.uf || 'SP');
        setCep(data.endereco.cep || '');
      }

      if (data.email && !userEmail) {
        setUserEmail(data.email);
      }
      if (data.telefone && !userPhone) {
        setUserPhone(data.telefone);
      }

      setIsCNPJValidated(true);
    } catch (err: unknown) {
      setCnpjError(err instanceof Error ? err.message : 'Erro ao consultar CNPJ na base pública.');
    } finally {
      setIsSearchingCNPJ(false);
    }
  };

  // Validação da Etapa 1
  const handleNextToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!cnpj.trim() || cnpj.replace(/\D/g, '').length !== 14) {
      setSubmitError('Informe um CNPJ válido com 14 dígitos.');
      return;
    }
    if (!razaoSocial.trim()) {
      setSubmitError('Informe a Razão Social da empresa.');
      return;
    }
    if (!logradouro.trim() || !numero.trim() || !cidade.trim() || !cep.trim()) {
      setSubmitError('Preencha os campos obrigatórios de endereço (Logradouro, Número, Cidade e CEP).');
      return;
    }

    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Validação da Etapa 2 e Submissão Final do Cadastro
  const handleFinishRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    // Validações cruciais de segurança
    if (!userName.trim()) {
      setSubmitError('Informe o nome completo do comprador responsável.');
      return;
    }
    if (!userEmail.trim() || !userEmail.includes('@')) {
      setSubmitError('Informe um e-mail corporativo válido.');
      return;
    }
    if (!userPhone.trim() || userPhone.replace(/\D/g, '').length < 10) {
      setSubmitError('Informe um telefone/celular de contato corporativo válido.');
      return;
    }
    if (password.length < 6) {
      setSubmitError('A senha de acesso deve possuir no mínimo 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setSubmitError('A confirmação de senha não confere com a senha digitada.');
      return;
    }
    if (!acceptTerms) {
      setSubmitError('Você deve concordar com os Termos de Uso e Política de Privacidade B2B para continuar.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(
        {
          cnpj: cnpj.replace(/\D/g, ''),
          razaoSocial: razaoSocial.trim(),
          nomeFantasia: nomeFantasia.trim() || razaoSocial.trim(),
          industrySegment: industrySegment,
          inscricaoEstadual: isentoIE ? 'ISENTO' : (inscricaoEstadual.trim() || 'ISENTO'),
          inscricaoMunicipal: inscricaoMunicipal.trim(),
          regimeTributario: regimeTributario,
          suframaCode: hasSuframa ? suframaCode.trim() : undefined,
          hasSuframaIncentive: hasSuframa,
          mainAddress: {
            logradouro: logradouro.trim(),
            numero: numero.trim(),
            complemento: complemento.trim(),
            bairro: bairro.trim(),
            cidade: cidade.trim(),
            uf: uf.toUpperCase(),
            cep: cep.replace(/\D/g, ''),
            pais: 'Brasil',
          },
        },
        {
          name: userName.trim(),
          email: userEmail.trim().toLowerCase(),
          role: userRole,
        },
        password
      );

      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Falha ao processar cadastro corporativo. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900 font-sans pb-24 pt-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Navigation & Back Link */}
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2563eb] hover:underline">
            <ArrowLeft className="w-4 h-4" /> Voltar para a Loja
          </Link>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-600 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-[#2563eb]" />
            <span>Ambiente Seguro B2B • Conexão Criptografada SSL</span>
          </div>
        </div>

        {/* Title Banner */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-blue-100/70 text-[#2563eb] text-xs font-black px-3.5 py-1.5 rounded-full border border-blue-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-600" /> Onboarding Empresarial Completo
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">
            Cadastro de Empresa & Conta Corporativa
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
            Cadastre seu CNPJ para ter acesso à tabela de preços diferenciada, faturamento a prazo via boleto, cotações em PDF e emissão automática de NF-e.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs">
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-bold">
            <div
              className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
                step === 1 ? 'bg-[#2563eb] text-white shadow-xs' : step > 1 ? 'bg-blue-50 text-[#2563eb] border border-blue-200' : 'text-gray-400 bg-gray-50'
              }`}
            >
              <Building2 className="w-4 h-4 shrink-0" />
              <span>1. Dados Fiscais & Sede</span>
            </div>
            <div
              className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
                step === 2 ? 'bg-[#2563eb] text-white shadow-xs' : step > 2 ? 'bg-blue-50 text-[#2563eb] border border-blue-200' : 'text-gray-400 bg-gray-50'
              }`}
            >
              <Lock className="w-4 h-4 shrink-0" />
              <span>2. Acesso, Senha & Responsável</span>
            </div>
            <div
              className={`py-3 px-2 rounded-xl transition-all flex items-center justify-center gap-2 ${
                step === 3 ? 'bg-[#2563eb] text-white shadow-xs' : 'text-gray-400 bg-gray-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>3. Conta Liberada</span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ETAPA 1: DADOS FISCAIS DA EMPRESA E ENDEREÇO                              */}
        {/* ========================================================================= */}
        {step === 1 && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs animate-in fade-in duration-200">
            
            {/* Escolha do Método de Preenchimento */}
            <div className="space-y-3 border-b border-gray-100 pb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-black text-gray-900 tracking-tight flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-[#2563eb]" /> Como deseja preencher os dados da empresa?
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Utilize a busca automática via CNPJ ou preencha manualmente campo a campo.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setFillMode('AUTO_CNPJ')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    fillMode === 'AUTO_CNPJ'
                      ? 'border-[#2563eb] bg-blue-50/50 ring-2 ring-[#2563eb]/20'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-[#2563eb] flex items-center justify-center shrink-0 font-bold">
                    ⚡
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900">Preenchimento Automático via CNPJ</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      Consulta a base da Receita Federal e preenche Razão Social, Endereço e Regime Tributário em 1 clique.
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFillMode('MANUAL')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3 ${
                    fillMode === 'MANUAL'
                      ? 'border-[#2563eb] bg-blue-50/50 ring-2 ring-[#2563eb]/20'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center shrink-0 font-bold">
                    ✍️
                  </div>
                  <div>
                    <p className="text-xs font-black text-gray-900">Preenchimento 100% Manual</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                      Digite manualmente todos os dados da empresa caso prefira ou caso o CNPJ esteja em constituição.
                    </p>
                  </div>
                </button>
              </div>
            </div>

            {/* BARRA DE BUSCA CNPJ (QUANDO MODO AUTO ATIVO) */}
            {fillMode === 'AUTO_CNPJ' && (
              <div className="bg-[#f8fafc] p-5 rounded-2xl border border-slate-200 space-y-3">
                <label className="text-xs font-bold text-gray-800 flex items-center justify-between">
                  <span>Digite o CNPJ da Empresa (apenas números ou com pontuação)</span>
                  <span className="text-[11px] font-normal text-blue-700 font-mono">Consulta Receita Federal Oficial</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <input
                    type="text"
                    value={cnpj}
                    onChange={(e) => handleCNPJChange(e.target.value)}
                    placeholder="00.000.000/0001-00"
                    maxLength={18}
                    className="flex-1 bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-4 py-3 text-sm font-mono font-bold text-gray-900 focus:outline-none shadow-2xs"
                  />
                  <button
                    type="button"
                    onClick={handleSearchCNPJ}
                    disabled={isSearchingCNPJ}
                    className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50 shrink-0"
                  >
                    {isSearchingCNPJ ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                        <span>Consultando Receita...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Autocompletar Dados</span>
                      </>
                    )}
                  </button>
                </div>
                {cnpjError && (
                  <p className="text-red-600 text-xs font-bold flex items-center gap-1.5 mt-1">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{cnpjError}</span>
                  </p>
                )}
                {isCNPJValidated && (
                  <div className="bg-blue-100/60 p-2.5 rounded-xl border border-blue-300 text-[11px] text-blue-900 font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>CNPJ validado com sucesso na Receita Federal! Você pode conferir e ajustar os campos abaixo:</span>
                  </div>
                )}
              </div>
            )}

            {/* FORMULÁRIO DE DADOS DA EMPRESA */}
            <form onSubmit={handleNextToStep2} className="space-y-6 text-xs">
              
              {/* Alerta de erro geral */}
              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Seção 1: Identificação Cadastral */}
              <div className="space-y-4">
                <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-[#2563eb]">
                  <FileText className="w-4 h-4" /> 1. Identificação Cadastral & Fiscal
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      CNPJ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={cnpj}
                      onChange={(e) => handleCNPJChange(e.target.value)}
                      placeholder="00.000.000/0001-00"
                      maxLength={18}
                      className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-4 py-3 text-xs font-mono font-bold text-gray-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Segmento de Atuação
                    </label>
                    <select
                      value={industrySegment}
                      onChange={(e) => setIndustrySegment(e.target.value)}
                      className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-4 py-3 text-xs font-bold text-gray-900 focus:outline-none"
                    >
                      <option value="Tecnologia & Informática">Tecnologia & Informática</option>
                      <option value="Indústria & Manufatura">Indústria & Manufatura</option>
                      <option value="Serviços & Consultoria">Serviços & Consultoria</option>
                      <option value="Comércio Varejista / Atacadista">Comércio Varejista / Atacadista</option>
                      <option value="Educação & Treinamento">Educação & Treinamento</option>
                      <option value="Saúde & Clínicas">Saúde & Clínicas</option>
                      <option value="Construção & Engenharia">Construção & Engenharia</option>
                      <option value="Outro Segmento">Outro Segmento</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Razão Social <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={razaoSocial}
                      onChange={(e) => setRazaoSocial(e.target.value)}
                      placeholder="ex: Tech Solutions & Tecnologia LTDA"
                      className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-4 py-3 text-xs font-bold text-gray-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Nome Fantasia (Como a empresa é conhecida)
                    </label>
                    <input
                      type="text"
                      value={nomeFantasia}
                      onChange={(e) => setNomeFantasia(e.target.value)}
                      placeholder="ex: Tech Solutions B2B"
                      className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-4 py-3 text-xs font-medium text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Inscrições e Regime Tributário */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-gray-700">Inscrição Estadual (IE)</label>
                      <label className="inline-flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isentoIE}
                          onChange={(e) => {
                            setIsentoIE(e.target.checked);
                            if (e.target.checked) setInscricaoEstadual('');
                          }}
                          className="rounded text-[#2563eb] focus:ring-0"
                        />
                        <span className="text-[10px] text-gray-500 font-bold">Isento / Não Contribuinte</span>
                      </label>
                    </div>
                    <input
                      type="text"
                      disabled={isentoIE}
                      value={isentoIE ? 'ISENTO' : inscricaoEstadual}
                      onChange={(e) => setInscricaoEstadual(e.target.value)}
                      placeholder="ex: 123.456.789.111"
                      className={`w-full border rounded-xl px-4 py-3 text-xs font-mono font-bold focus:outline-none ${
                        isentoIE ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white text-gray-900 border-gray-300 focus:border-[#2563eb]'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Inscrição Municipal</label>
                    <input
                      type="text"
                      value={inscricaoMunicipal}
                      onChange={(e) => setInscricaoMunicipal(e.target.value)}
                      placeholder="Opcional (ex: 9876543)"
                      className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-4 py-3 text-xs font-mono font-bold text-gray-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Regime Tributário <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={regimeTributario}
                      onChange={(e) => setRegimeTributario(e.target.value as 'LUCRO_PRESUMIDO' | 'LUCRO_REAL' | 'SIMPLES_NACIONAL')}
                      className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-4 py-3 text-xs font-bold text-gray-900 focus:outline-none"
                    >
                      <option value="LUCRO_PRESUMIDO">Lucro Presumido</option>
                      <option value="LUCRO_REAL">Lucro Real (Grandes Contas)</option>
                      <option value="SIMPLES_NACIONAL">Simples Nacional</option>
                    </select>
                  </div>
                </div>

                {cnaePrincipal && (
                  <div className="bg-slate-100/70 p-3 rounded-xl text-[11px] text-gray-600 font-mono">
                    <strong className="text-gray-800">CNAE Principal:</strong> {cnaePrincipal}
                  </div>
                )}
              </div>

              {/* Seção 2: Endereço Fiscal da Sede */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-[#2563eb]">
                  <MapPin className="w-4 h-4" /> 2. Endereço Fiscal / Sede da Empresa
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      CEP <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={cep}
                      onChange={(e) => handleCEPChange(e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                      className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-4 py-3 text-xs font-mono font-bold text-gray-900 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="font-bold text-gray-700 block mb-1">
                      Logradouro / Rua / Avenida <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={logradouro}
                      onChange={(e) => setLogradouro(e.target.value)}
                      placeholder="ex: Av. Paulista"
                      className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-4 py-3 text-xs font-medium text-gray-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Número <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={numero}
                      onChange={(e) => setNumero(e.target.value)}
                      placeholder="ex: 1000"
                      className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-4 py-3 text-xs font-bold text-gray-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Complemento / Sala</label>
                    <input
                      type="text"
                      value={complemento}
                      onChange={(e) => setComplemento(e.target.value)}
                      placeholder="ex: Conjunto 42"
                      className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-4 py-3 text-xs font-medium text-gray-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Bairro</label>
                    <input
                      type="text"
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      placeholder="ex: Bela Vista"
                      className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-4 py-3 text-xs font-medium text-gray-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">Cidade</label>
                        <input
                          type="text"
                          required
                          value={cidade}
                          onChange={(e) => setCidade(e.target.value)}
                          placeholder="São Paulo"
                          className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-3 py-3 text-xs font-medium text-gray-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="font-bold text-gray-700 block mb-1">UF</label>
                        <select
                          value={uf}
                          onChange={(e) => setUf(e.target.value)}
                          className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-2 py-3 text-xs font-bold text-gray-900 focus:outline-none"
                        >
                          {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(u => (
                            <option key={u} value={u}>{u}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zona Franca de Manaus / SUFRAMA */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                    <input
                      type="checkbox"
                      checked={hasSuframa}
                      onChange={(e) => setHasSuframa(e.target.checked)}
                      className="w-4 h-4 rounded text-[#2563eb] focus:ring-0"
                    />
                    <span>A empresa possui Incentivo Fiscal SUFRAMA / Zona Franca de Manaus (ZFM)?</span>
                  </label>
                  {hasSuframa && (
                    <div className="pt-1 max-w-sm">
                      <label className="font-bold text-gray-700 block mb-1">Código de Inscrição SUFRAMA</label>
                      <input
                        type="text"
                        value={suframaCode}
                        onChange={(e) => setSuframaCode(e.target.value)}
                        placeholder="ex: SUF-987654-ZFM"
                        className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-4 py-2.5 text-xs font-mono font-bold text-gray-900 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Botão de Avanço para a Etapa 2 */}
              <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                <Link href="/" className="text-xs font-bold text-gray-500 hover:text-gray-800">
                  Cancelar
                </Link>

                <button
                  type="submit"
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold px-8 py-4 rounded-full transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:scale-102"
                >
                  <span>Avançar para Senha & Acesso</span>
                  <ArrowRight className="w-4 h-4 text-amber-300" />
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ETAPA 2: DADOS CRUCIAIS DE ACESSO, SENHA, COMPRADOR & PREFERÊNCIAS        */}
        {/* ========================================================================= */}
        {step === 2 && (
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs animate-in fade-in duration-200">
            
            <div className="border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2.5 text-blue-800 font-bold text-xs mb-1">
                <Building2 className="w-4 h-4 text-[#2563eb]" />
                <span>Empresa: {razaoSocial || cnpj} ({cnpj})</span>
              </div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">
                Dados do Responsável pela Conta & Senha de Acesso
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Estas informações são exclusivas da sua equipe e serão usadas para login, recebimento de faturas e aprovação de compras.
              </p>
            </div>

            <form onSubmit={handleFinishRegistration} className="space-y-6 text-xs">
              
              {/* Alerta de Erro */}
              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {/* Seção A: Usuário Comprador / Administrador */}
              <div className="space-y-4">
                <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-[#2563eb]">
                  <UserCheck className="w-4 h-4" /> 1. Responsável / Comprador Autorizado
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Nome Completo do Comprador / Gestor <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="ex: Carlos Eduardo Silva"
                      className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-4 py-3 text-xs font-medium text-gray-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      E-mail Corporativo de Acesso <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        value={userEmail}
                        onChange={(e) => setUserEmail(e.target.value)}
                        placeholder="ex: carlos.compras@suaempresa.com.br"
                        className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl pl-10 pr-4 py-3 text-xs font-medium text-gray-900 focus:outline-none"
                      />
                      <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Telefone / WhatsApp Corporativo <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={userPhone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        placeholder="(11) 98765-4321"
                        maxLength={15}
                        className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl pl-10 pr-4 py-3 text-xs font-medium text-gray-900 focus:outline-none"
                      />
                      <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Departamento</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="ex: Compras / TI / Financeiro"
                      className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-4 py-3 text-xs font-medium text-gray-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Perfil / Alçada de Compra</label>
                    <select
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value as 'BUYER' | 'APPROVER' | 'ADMIN')}
                      className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-4 py-3 text-xs font-bold text-gray-900 focus:outline-none"
                    >
                      <option value="BUYER">Comprador (Monta pedidos e carrinhos)</option>
                      <option value="APPROVER">Gestor Financeiro / Aprovador</option>
                      <option value="ADMIN">Administrador Geral da Empresa</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Seção B: Senha & Segurança */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-[#2563eb]">
                  <Lock className="w-4 h-4" /> 2. Senha de Acesso & Segurança
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Crie uma Senha Segura <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-4 py-3 text-xs font-medium text-gray-900 focus:outline-none pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">
                      Confirme a Senha <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Repita a mesma senha"
                        className="w-full bg-white border border-gray-300 focus:border-[#2563eb] rounded-xl px-4 py-3 text-xs font-medium text-gray-900 focus:outline-none pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {password && confirmPassword && password !== confirmPassword && (
                  <p className="text-red-600 text-[11px] font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    As senhas não coincidem.
                  </p>
                )}
                {password && confirmPassword && password === confirmPassword && (
                  <p className="text-blue-700 text-[11px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    Senhas coincidem perfeitamente.
                  </p>
                )}
              </div>

              {/* Seção C: Faturamento & Limite de Crédito Desejado */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <h3 className="font-black text-gray-900 text-xs uppercase tracking-wider flex items-center gap-1.5 text-[#2563eb]">
                  <CreditCard className="w-4 h-4" /> 3. Preferências de Faturamento B2B
                </h3>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-gray-900 text-xs block">Limite de Crédito Inicial Solicitado (Boleto Faturado)</span>
                      <span className="text-[11px] text-gray-500">
                        Análise de crédito automatizada com aprovação em até 2 horas.
                      </span>
                    </div>
                    <select
                      value={requestedCreditLimit}
                      onChange={(e) => setRequestedCreditLimit(e.target.value)}
                      className="bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-xs font-bold text-[#2563eb] focus:outline-none"
                    >
                      <option value="25000">R$ 25.000,00 (Pequeno Porte)</option>
                      <option value="50000">R$ 50.000,00 (Médio Porte - Padrão)</option>
                      <option value="100000">R$ 100.000,00 (Grande Porte)</option>
                      <option value="250000">R$ 250.000,00 (Corporativo / Indústria)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="flex items-start gap-2.5 cursor-pointer text-xs text-gray-700">
                    <input
                      type="checkbox"
                      required
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-4 h-4 rounded text-[#2563eb] focus:ring-0 mt-0.5"
                    />
                    <span className="leading-relaxed">
                      Declaro que sou representante autorizado da empresa e concordo com os{' '}
                      <Link href="/termos" target="_blank" className="font-bold text-[#2563eb] underline">
                        Termos de Fornecimento B2B
                      </Link>{' '}
                      e com o tratamento de dados corporativos de acordo com a LGPD.
                    </span>
                  </label>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="pt-6 flex items-center justify-between border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-gray-500 hover:text-gray-900 cursor-pointer"
                >
                  ← Voltar para Dados Fiscais
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold px-8 py-4 rounded-full transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:scale-102 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                      <span>Cadastrando Empresa...</span>
                    </>
                  ) : (
                    <>
                      <span>Concluir Cadastro & Ativar Conta</span>
                      <CheckCircle2 className="w-4 h-4 text-amber-300" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ETAPA 3: SUCESSO & BOAS-VINDAS                                            */}
        {/* ========================================================================= */}
        {step === 3 && (
          <div className="bg-white border border-gray-200 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xs animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-blue-100 text-[#2563eb] flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-12 h-12 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#2563eb] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                Cadastro Aprovado com Sucesso!
              </span>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                Bem-vindo à OneSync B2B
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
                A empresa <strong className="text-gray-900">{razaoSocial}</strong> (CNPJ: {cnpj}) foi registrada no sistema. Seu login corporativo com o e-mail <strong>{userEmail}</strong> está ativo!
              </p>
            </div>

            {/* Approved Summary Card */}
            <div className="bg-slate-50 p-6 rounded-2xl max-w-lg mx-auto space-y-3 text-xs border border-blue-200 text-left">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
                <span className="font-bold text-gray-700 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#2563eb]" /> Limite Pré-Aprovado para Boleto:
                </span>
                <span className="font-black text-[#2563eb] text-base">
                  R$ {Number(requestedCreditLimit).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-600 pt-1">
                <div>
                  <strong>Comprador:</strong> {userName}
                </div>
                <div>
                  <strong>E-mail:</strong> {userEmail}
                </div>
                <div>
                  <strong>Regime Tributário:</strong> {regimeTributario}
                </div>
                <div>
                  <strong>Inscrição Estadual:</strong> {isentoIE ? 'Isento' : inscricaoEstadual || 'Não Informada'}
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/produtos"
                className="w-full sm:w-auto bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold px-8 py-4 rounded-full transition-all shadow-sm hover:scale-105"
              >
                Acessar Catálogo & Fazer Primeiro Pedido
              </Link>
              <Link
                href="/conta"
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-6 py-4 rounded-full transition-colors"
              >
                Ir para o Painel da Empresa
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
