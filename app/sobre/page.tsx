'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Truck, Target, ArrowRight } from 'lucide-react';

export default function SobrePage() {
  return (
    <div className="bg-white min-h-screen pb-20 pt-8 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 space-y-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium border-b border-gray-100 pb-4">
          <Link href="/" className="hover:text-[#004e38]">Home</Link>
          <span>/</span>
          <span className="font-bold text-gray-900">Sobre Nós</span>
        </div>

        {/* Hero Section */}
        <div className="bg-[#f9ece4] rounded-3xl p-8 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span className="inline-block bg-[#004e38] text-white text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Nossa História & Propósito B2B
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#004e38] tracking-tight leading-tight">
              Transformando a Cadeia de Suprimentos & Eletrônicos no Brasil
            </h1>
            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed max-w-2xl">
              Fundada em 2018, a <strong>Shopcart Brasil Ltda.</strong> nasceu com a missão de eliminar a burocracia do compras corporativas (Procurement B2B). Conectamos indústrias, revendedores e grandes corporações através de uma plataforma com inteligência tributária automatizada, estoque distribuído em múltiplos Centros de Distribuição e concessão rápida de limite de crédito.
            </p>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/3] bg-white rounded-2xl p-4 shadow-sm flex items-center justify-center">
            <Image
              src="/media/hero_headphones_woman_1786558954100.jpg"
              alt="Sobre a Shopcart B2B"
              fill
              className="object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Statistics Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-[#f5f6f6] p-8 rounded-3xl text-center">
          <div className="space-y-1">
            <div className="text-3xl font-black text-[#004e38]">R$ 450M+</div>
            <p className="text-xs font-semibold text-gray-600">Volume Faturado em B2B</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-[#004e38]">12.000+</div>
            <p className="text-xs font-semibold text-gray-600">Empresas Cadastradas</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-[#004e38]">3 CDs</div>
            <p className="text-xs font-semibold text-gray-600">São Paulo, Joinville & Camaçari</p>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-black text-[#004e38]">99.4%</div>
            <p className="text-xs font-semibold text-gray-600">Entregas no Prazo (SLA)</p>
          </div>
        </div>

        {/* Pillars Section */}
        <div className="space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Os Pilares que Sustentam Nossa Operação
            </h2>
            <p className="text-xs text-gray-500">
              Desenvolvemos soluções pensadas exclusivamente para atender a complexidade do ambiente empresarial brasileiro.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#004e38] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-gray-900">Motor Tributário Inteligente</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Nossos algoritmos realizam a substituição tributária (ICMS-ST), DIFAL e isenções fiscais (SUFRAMA/ZFM) em tempo real no momento do checkout por CNPJ.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#004e38] flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-gray-900">Malha Logística Própria e Parceira</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Operamos com expedição expressa e frete regulado (CIF e FOB) direto dos nossos hubs estratégicos em São Paulo, Santa Catarina e Bahia.
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#004e38] flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-gray-900">Crédito & Faturamento Flexível</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Mesa de crédito própria capaz de liberar prazos de 28, 56 e 84 dias no boleto bancário sem burocracia para empresas ativas.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Box */}
        <div className="bg-[#004e38] text-white p-8 lg:p-12 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-2xl font-black">Pronto para abastecer sua empresa com a Shopcart?</h3>
            <p className="text-xs text-emerald-100 max-w-lg">
              Cadastre seu CNPJ em menos de 1 minuto e libere acesso imediato ao nosso catálogo com preços faturados.
            </p>
          </div>

          <Link
            href="/cadastro"
            className="bg-white hover:bg-emerald-50 text-[#004e38] font-bold text-xs px-8 py-3.5 rounded-full transition-all shadow-md shrink-0 flex items-center gap-2"
          >
            <span>Cadastrar Minha Empresa</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
