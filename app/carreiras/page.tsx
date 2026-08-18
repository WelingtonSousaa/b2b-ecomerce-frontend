'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Briefcase, Users, HeartHandshake, CheckCircle2, MapPin, Clock } from 'lucide-react';

export default function CarreirasPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const jobs = [
    {
      id: 'job-1',
      title: 'Engenheiro(a) de Software Senior (Next.js & Node.js)',
      department: 'Tecnologia & Produto',
      location: 'São Paulo - SP (Modelo Híbrido)',
      type: 'Tempo Integral',
      description: 'Responsável pelo desenvolvimento da nossa plataforma e-commerce B2B de alta disponibilidade, integração de motores tributários e microsserviços de crédito.'
    },
    {
      id: 'job-2',
      title: 'Gerente de Contas B2B (Key Account Manager)',
      department: 'Vendas Corporativas',
      location: 'São Paulo - SP (Presencial / Externo)',
      type: 'Tempo Integral',
      description: 'Gestão de carteira de grandes corporações, negociação de lote de compras com indústrias e expansão de faturamento em contas estratégicas.'
    },
    {
      id: 'job-3',
      title: 'Analista de Planejamento Fiscal & Tributário',
      department: 'Financeiro & Tax',
      location: 'Joinville - SC (Híbrido)',
      type: 'Tempo Integral',
      description: 'Análise de regras estaduais de ICMS-ST, DIFAL, incentivos da Zona Franca de Manaus (SUFRAMA) e homologação de notas fiscais eletrônicas (NF-e).'
    },
    {
      id: 'job-4',
      title: 'Coordenador(a) de Logística Multi-CD',
      department: 'Operações & Supply Chain',
      location: 'Camaçari - BA (Presencial)',
      type: 'Tempo Integral',
      description: 'Supervisão de fluxo de expedição, gestão de transportadoras parceiras (CIF/FOB), WMS e controle de nível de estoque de segurança.'
    }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen pb-20 pt-8 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 space-y-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium border-b border-gray-100 pb-4">
          <Link href="/" className="hover:text-[#004e38]">Home</Link>
          <span>/</span>
          <span className="font-bold text-gray-900">Carreiras</span>
        </div>

        {/* Hero Section */}
        <div className="bg-[#f5f6f6] rounded-3xl p-8 lg:p-14 text-center space-y-4">
          <span className="inline-block bg-emerald-100 text-[#004e38] text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Trabalhe Conosco
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Construa o Futuro do Comércio B2B no Brasil
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Somos um time apaixonado por inovação, tecnologia e eficiência. Na Shopcart, incentivamos a autonomia, a diversidade e o desenvolvimento contínuo dos nossos talentos.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight text-center">
            Por que Fazer Parte do Time Shopcart?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-3xl border border-gray-200 space-y-2">
              <HeartHandshake className="w-8 h-8 text-[#004e38]" />
              <h3 className="text-base font-extrabold text-gray-900">Saúde & Bem-Estar</h3>
              <p className="text-xs text-gray-500">Plano de Saúde Bradesco Top Nacional, Plano Odontológico, Gympass e auxílio saúde mental.</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-gray-200 space-y-2">
              <Briefcase className="w-8 h-8 text-[#004e38]" />
              <h3 className="text-base font-extrabold text-gray-900">Crescimento & Carreira</h3>
              <p className="text-xs text-gray-500">PLR semestral atrelada a metas, orçamento anual para cursos/certificações e plano de cargos estruturado.</p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-gray-200 space-y-2">
              <Users className="w-8 h-8 text-[#004e38]" />
              <h3 className="text-base font-extrabold text-gray-900">Flexibilidade Híbrida</h3>
              <p className="text-xs text-gray-500">Ambiente de trabalho flexível com auxílio home-office e escritórios modernos em SP, SC e BA.</p>
            </div>
          </div>
        </div>

        {/* Open Positions List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Vagas Abertas em Destaque
          </h2>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-3xl border border-gray-200 hover:border-[#004e38] transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-emerald-50 text-[#004e38] text-[10px] font-bold px-2.5 py-1 rounded-md">
                      {job.department}
                    </span>
                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {job.location}
                    </span>
                    <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {job.type}
                    </span>
                  </div>

                  <h3 className="text-lg font-black text-gray-900">{job.title}</h3>
                  <p className="text-xs text-gray-600 max-w-2xl">{job.description}</p>
                </div>

                <button
                  onClick={() => setSelectedJob(job.title)}
                  className="bg-[#004e38] hover:bg-[#033627] text-white text-xs font-bold px-6 py-3 rounded-full transition-all shrink-0 cursor-pointer text-center"
                >
                  Candidatar-se à Vaga
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Candidate Form */}
        {selectedJob && (
          <div className="border border-gray-200 rounded-3xl p-6 lg:p-8 bg-[#f5f6f6] space-y-4 animate-in fade-in duration-200">
            <h3 className="text-lg font-black text-gray-900">
              Candidatura para: <span className="text-[#004e38]">{selectedJob}</span>
            </h3>

            {!submitted ? (
              <form onSubmit={handleApply} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Nome Completo*</label>
                  <input type="text" required placeholder="Digite seu nome..." className="w-full bg-white rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none" />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">E-mail de Contato*</label>
                  <input type="email" required placeholder="seu.email@exemplo.com" className="w-full bg-white rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none" />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Telefone / WhatsApp*</label>
                  <input type="text" required placeholder="(11) 99999-9999" className="w-full bg-white rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none" />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Link do Perfil no LinkedIn*</label>
                  <input type="url" required placeholder="https://linkedin.com/in/seu-perfil" className="w-full bg-white rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none" />
                </div>

                <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="px-5 py-2.5 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-100"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#004e38] hover:bg-[#033627] text-white font-bold px-8 py-2.5 rounded-full transition-all shadow-xs cursor-pointer"
                  >
                    Enviar Candidatura
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-white p-6 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#004e38] mx-auto" />
                <h4 className="text-base font-bold text-gray-900">Candidatura Recebida com Sucesso!</h4>
                <p className="text-xs text-gray-500">Nosso time de Talent Acquisition analisará seu perfil e entrará em contato em breve.</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
