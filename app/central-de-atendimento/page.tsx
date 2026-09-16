'use client';

import React from 'react';
import Link from 'next/link';
import { CreditCard, Truck, RefreshCcw, FileText, Phone, Mail, ArrowRight } from 'lucide-react';

export default function CentralAtendimentoPage() {
  const supportChannels = [
    {
      icon: CreditCard,
      title: 'Mesa de Análise de Crédito',
      desc: 'Dúvidas sobre limite de crédito corporativo, análise de balanço, faturamento faturado (28/56/84 dias) e liberação de cadastro.',
      phone: '0800 123 4567 - Ramal 1',
      email: 'credito@onesync.com.br'
    },
    {
      icon: FileText,
      title: 'Emissão de Notas & Impostos',
      desc: 'Segunda via de danfe, arquivo XML, correções em NF-e, carta de correção (CC-e) e apuração de ICMS-ST / DIFAL.',
      phone: '0800 123 4567 - Ramal 2',
      email: 'nfe@onesync.com.br'
    },
    {
      icon: Truck,
      title: 'Rastreamento & Expedição Multi-CD',
      desc: 'Status de envio, agendamento de descargas corporativas, CTE e acompanhamento de cargas em trânsito (CIF e FOB).',
      phone: '0800 123 4567 - Ramal 3',
      email: 'logistica@onesync.com.br'
    },
    {
      icon: RefreshCcw,
      title: 'RMA, Trocas & Devoluções',
      desc: 'Abertura de chamados de garantia de fábrica, avarias de transporte, ressalvas de conhecimento de frete e devolução legal em 30 dias.',
      phone: '0800 123 4567 - Ramal 4',
      email: 'rma@onesync.com.br'
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-20 pt-8 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 space-y-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium border-b border-gray-100 pb-4">
          <Link href="/" className="hover:text-[#2563eb]">Home</Link>
          <span>/</span>
          <span className="font-bold text-gray-900">Central de Atendimento</span>
        </div>

        {/* Hero Section */}
        <div className="bg-[#f5f6f6] rounded-3xl p-8 lg:p-14 text-center space-y-4">
          <span className="inline-block bg-[#2563eb] text-white text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Suporte Dedicado B2B
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Central de Atendimento ao Cliente Corporativo
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Selecione a área especializada desejada para suporte direto com nossos analistas fiscais, gerentes de conta e especialistas em logística.
          </p>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {supportChannels.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-8 rounded-3xl border border-gray-200 shadow-2xs space-y-4 hover:border-[#2563eb] transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563eb] flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-extrabold text-gray-900">{item.title}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.desc}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 space-y-1.5 text-xs font-semibold text-gray-800">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-[#2563eb]" />
                    <span>{item.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#2563eb]" />
                    <span>{item.email}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Links Banner */}
        <div className="bg-[#2563eb] text-white p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-extrabold">Precisa enviar uma mensagem personalizada?</h4>
            <p className="text-xs text-blue-100">Acesse nosso formulário de contato com resposta em até 2h úteis.</p>
          </div>
          <Link
            href="/contato"
            className="bg-white hover:bg-blue-50 text-[#2563eb] font-bold text-xs px-6 py-3 rounded-full transition-all shrink-0 flex items-center gap-1.5"
          >
            <span>Ir para Formulário de Contato</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
