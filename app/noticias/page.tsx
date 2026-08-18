'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, ArrowRight } from 'lucide-react';

export default function NoticiasPage() {
  const articles = [
    {
      id: 'art-1',
      title: 'Impacto da Reforma Tributária no ICMS-ST e Compras por CNPJ em 2026',
      category: 'Tributação & Fiscal',
      date: '08 de Agosto de 2026',
      readTime: '6 min de leitura',
      author: 'Juliana Mendes • Especialista Fiscal Shopcart',
      image: '/media/img1.jpeg',
      excerpt: 'Entenda como o novo IVA Dual afeta a substituição tributária, o cálculo do DIFAL em operações interestaduais e como automatizar a emissão de notas fiscais.'
    },
    {
      id: 'art-2',
      title: 'Tendências de Headsets ANC para Ambientes Corporativos de Alta Produtividade',
      category: 'Produtos & Tecnologia',
      date: '02 de Agosto de 2026',
      readTime: '4 min de leitura',
      author: 'Ricardo Alves • Head de Produtos Áudio',
      image: '/media/airpods_max_pink.jpg',
      excerpt: 'Pesquisa revela que equipamentos com cancelamento ativo de ruído (ANC) aumentam em 34% o foco de equipes em regime de teletrabalho e contact centers.'
    },
    {
      id: 'art-3',
      title: 'Faturamento no Boleto B2B: Como Otimizar o Fluxo de Caixa da Sua Empresa',
      category: 'Finanças & Crédito',
      date: '25 de Julho de 2026',
      readTime: '5 min de leitura',
      author: 'Fernanda Lima • Gerente de Crédito B2B',
      image: '/media/img3.jpeg',
      excerpt: 'Descubra como os prazos de faturamento flexíveis em 28, 56 e 84 dias permitem manter o capital de giro protegido enquanto sua empresa expande o estoque.'
    },
    {
      id: 'art-4',
      title: 'Logística Multi-CD: Como Reduzimos em 48h as Entregas no Sul e Nordeste',
      category: 'Logística & Supply Chain',
      date: '18 de Julho de 2026',
      readTime: '7 min de leitura',
      author: 'Marcelo Rossi • Diretor de Operações',
      image: '/media/wireless_earbuds.jpg',
      excerpt: 'Estudo de caso detalhando a distribuição estratégica nos Centros de Distribuição de São Paulo, Joinville e Camaçari para otimização de frete CIF/FOB.'
    }
  ];

  return (
    <div className="bg-white min-h-screen pb-20 pt-8 font-sans">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 space-y-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium border-b border-gray-100 pb-4">
          <Link href="/" className="hover:text-[#004e38]">Home</Link>
          <span>/</span>
          <span className="font-bold text-gray-900">Notícias & Blog B2B</span>
        </div>

        {/* Title Header */}
        <div className="space-y-3 border-b border-gray-100 pb-8">
          <span className="inline-block bg-emerald-100 text-[#004e38] text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider">
            Blog & Análises do Mercado B2B
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight">
            Notícias, Gestão Fiscal & Tendências da Indústria
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-3xl">
            Acompanhe artigos exclusivos elaborados pelos especialistas em tributação, logística e produtos da Shopcart Brasil.
          </p>
        </div>

        {/* Featured Article */}
        <div className="bg-[#f5f6f6] rounded-3xl p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-gray-200">
          <div className="lg:col-span-6 relative aspect-video bg-white rounded-2xl overflow-hidden shadow-2xs">
            <Image src={articles[0].image} alt="" fill className="object-cover" />
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="flex items-center gap-3 text-xs">
              <span className="bg-[#004e38] text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                Destaque da Semana
              </span>
              <span className="text-gray-500 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {articles[0].date}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight">
              {articles[0].title}
            </h2>

            <p className="text-xs text-gray-600 leading-relaxed">
              {articles[0].excerpt}
            </p>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-700">{articles[0].author}</span>
              <span className="text-xs font-bold text-[#004e38] hover:underline flex items-center gap-1 cursor-pointer">
                Ler Artigo Completo <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        <div className="space-y-6">
          <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            Últimas Publicações
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {articles.slice(1).map((art) => (
              <div key={art.id} className="flex flex-col bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xs group hover:border-[#004e38] transition-all">
                <div className="relative aspect-video w-full bg-gray-100">
                  <Image src={art.image} alt={art.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium">
                      <span className="text-[#004e38] font-bold">{art.category}</span>
                      <span>{art.readTime}</span>
                    </div>

                    <h4 className="text-base font-extrabold text-gray-900 group-hover:text-[#004e38] transition-colors leading-snug">
                      {art.title}
                    </h4>

                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-medium text-[11px]">{art.date}</span>
                    <span className="font-bold text-[#004e38] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      Ler <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
