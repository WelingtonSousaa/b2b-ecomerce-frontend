'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  Headphones,
  Laptop,
  BookOpen,
  Armchair,
  ShoppingBag,
  Shirt,
  Server,
  Cpu,
  Truck,
  Building2,
  ArrowRight,
  Boxes,
  FileCheck2,
  Percent
} from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  count: string;
  totalProducts: number;
  icon: React.ComponentType<{ className?: string }>;
  image: string;
  description: string;
  subcategories: string[];
  moq: string;
  taxBenefits: string;
  leadTime: string;
  highlighted: boolean;
}

export default function CategoriasPage() {
  const [searchFilter, setSearchFilter] = useState('');

  const allCategories: CategoryItem[] = [
    {
      id: 'cat-fones',
      name: 'Fones & Áudio Corporativo',
      slug: 'fones-audio',
      count: '240 itens disponíveis',
      totalProducts: 240,
      icon: Headphones,
      image: '/media/airpods_max_pink.jpg',
      description: 'Headsets profissionais com cancelamento de ruído (ANC), microfones boom para call centers, fones TWS corporativos e soundbars para videoconferência.',
      subcategories: ['Headsets Call Center USB', 'Fones TWS ANC', 'Over-Ear Estúdio', 'Bases Dock UC', 'Microfones de Mesa'],
      moq: 'A partir de 5 un.',
      taxBenefits: 'IPI Reduzido / Crédito ICMS 12%',
      leadTime: 'Pronta entrega CD-SP / CD-SC',
      highlighted: true,
    },
    {
      id: 'cat-computadores',
      name: 'Computadores & TI Empresarial',
      slug: 'computadores-ti',
      count: '180 itens disponíveis',
      totalProducts: 180,
      icon: Laptop,
      image: '/media/laptop_enterprise.jpg',
      description: 'Notebooks corporativos com chip de segurança TPM 2.0 e vPro, Desktops compactos Tiny/SFF, All-in-One e Estações de Trabalho para engenharia.',
      subcategories: ['Notebooks Corporativos i5/i7', 'Workstations Gráficas', 'Desktops Mini/SFF', 'Docks Thunderbolt 4', 'Acessórios TI'],
      moq: 'A partir de 2 un.',
      taxBenefits: 'PPB / Isenção Lei de Informática',
      leadTime: 'Pronta entrega CD-SP',
      highlighted: true,
    },
    {
      id: 'cat-monitores',
      name: 'Monitores & Periféricos',
      slug: 'monitores',
      count: '145 itens disponíveis',
      totalProducts: 145,
      icon: Cpu,
      image: '/media/smart_monitor_4k.jpg',
      description: 'Monitores 4K Ultrawide com hubs USB-C 90W integrados, setups duplos calibrados sRGB para design, suportes articulados a gás e teclados ergonômicos.',
      subcategories: ['Monitores 34" 4K Ultrawide', 'Monitores IPS 27" QHD', 'Suportes Articulados', 'Kits Teclado e Mouse Sem Fio', 'Hubs e Adaptadores'],
      moq: 'A partir de 3 un.',
      taxBenefits: 'Crédito de PIS/COFINS Ativo',
      leadTime: 'Pronta entrega CD-SP / CD-BA',
      highlighted: true,
    },
    {
      id: 'cat-servidores',
      name: 'Redes & Servidores Enterprise',
      slug: 'redes-servidores',
      count: '95 itens disponíveis',
      totalProducts: 95,
      icon: BookOpen,
      image: '/media/server_rack_nas.jpg',
      description: 'Storages NAS centralizados de alta performance com gavetas hot-swap, switches gerenciáveis PoE+ L2/L3, roteadores Wi-Fi 6E mesh e nobreaks senoidais.',
      subcategories: ['Servidores NAS 4 a 16 Baias', 'Switches PoE+ Gerenciáveis', 'Roteadores Wi-Fi 6E', 'HDs Enterprise IronWolf/WD Red', 'Nobreaks Online'],
      moq: 'A partir de 1 un.',
      taxBenefits: 'Faturamento Direto Distribuidor',
      leadTime: 'Pronta entrega CD-SC',
      highlighted: false,
    },
    {
      id: 'cat-moveis',
      name: 'Mobiliário Ergonômico & Escritório',
      slug: 'moveis-escritorio',
      count: '240 itens disponíveis',
      totalProducts: 240,
      icon: Armchair,
      image: '/media/ergonomic_chair.jpg',
      description: 'Cadeiras presidente e operacionais certificadas pela Norma NR-17 em tela mesh respirável, mesas elétricas de altura ajustável e painéis acústicos.',
      subcategories: ['Cadeiras NR-17 Presidente', 'Mesas com Ajuste de Altura', 'Apoios de Pés Ergonômicos', 'Gaveteiros Volantes', 'Painéis Divisores Acústicos'],
      moq: 'A partir de 2 un.',
      taxBenefits: 'Desconto Progressivo em Lotes > 20 un.',
      leadTime: 'Pronta entrega CD-SP / CD-BA',
      highlighted: true,
    },
    {
      id: 'cat-impressao',
      name: 'Impressão & Gestão de Documentos',
      slug: 'impressao-suprimentos',
      count: '85 itens disponíveis',
      totalProducts: 85,
      icon: Shirt,
      image: '/media/laser_printer.jpg',
      description: 'Multifuncionais laser coloridas departamentais com fluxo A4/A3, impressoras térmicas industriais para logística e suprimentos de toners originais OEM.',
      subcategories: ['Multifuncionais Laser Flow', 'Impressoras Térmicas de Etiquetas', 'Toners e Cilindros Originais', 'Scanners Departamentais', 'Papéis e Etiquetas'],
      moq: 'A partir de 1 un.',
      taxBenefits: 'Garantia On-Site 3 Anos',
      leadTime: 'Pronta entrega CD-SP',
      highlighted: false,
    },
    {
      id: 'cat-cftv',
      name: 'Segurança Eletrônica & CFTV',
      slug: 'seguranca-cftv',
      count: '120 itens disponíveis',
      totalProducts: 120,
      icon: ShoppingBag,
      image: '/media/security_camera.jpg',
      description: 'Câmeras de segurança IP Dome e Bullet 4K com visão noturna colorida Starvis e inteligência artificial para detecção humana e leitura de placas.',
      subcategories: ['Câmeras IP Dome 4K', 'Gravadores NVR Inteligentes', 'Leitores Biométricos e Faciais', 'Fechaduras Eletroímã', 'Cabos de Rede Cat6'],
      moq: 'A partir de 4 un.',
      taxBenefits: 'Isenção ST por Regime Especial',
      leadTime: 'Pronta entrega CD-SP / CD-SC',
      highlighted: false,
    },
    {
      id: 'cat-infraestrutura',
      name: 'Infraestrutura de TI & Datacenter',
      slug: 'infraestrutura-ti',
      count: '60 itens disponíveis',
      totalProducts: 60,
      icon: Server,
      image: '/media/server_rack_nas.jpg',
      description: 'Racks de servidor 19 polegadas de 12U a 44U com ventilação forçada, réguas PDU inteligentes, patch panels blindados e organizadores horizontais.',
      subcategories: ['Racks 19" Fechados e de Parede', 'Réguas PDU Gerenciáveis', 'Patch Panels Cat6A', 'Guia de Cabos e Bandejas', 'Sistemas de Refrigeração'],
      moq: 'A partir de 1 un.',
      taxBenefits: 'Projetos Turn-Key com Faturamento 60dd',
      leadTime: 'Pronta entrega CD-SP',
      highlighted: false,
    },
  ];

  // Filter categories by search
  const filteredCategories = allCategories.filter((cat) => {
    const q = searchFilter.toLowerCase();
    return (
      cat.name.toLowerCase().includes(q) ||
      cat.description.toLowerCase().includes(q) ||
      cat.subcategories.some((sub) => sub.toLowerCase().includes(q))
    );
  });

  return (
    <div className="bg-[#fcfdfd] min-h-screen pb-20 font-sans">
      
      {/* 1. HERO BANNER DA PÁGINA DE CATEGORIAS */}
      <section className="bg-gradient-to-b from-[#004e38] to-[#023b2b] text-white py-12 px-4 lg:px-12 relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto space-y-6 relative z-10">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-emerald-200">
            <Link href="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="text-white font-bold">Todas as Categorias</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-bold backdrop-blur-xs">
                <Boxes className="w-3.5 h-3.5" />
                <span>Catálogo Completo B2B</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Todas as Categorias Corporativas
              </h1>
              <p className="text-emerald-100/90 text-sm leading-relaxed">
                Navegue pelos departamentos especializados para aquisições por CNPJ, reposição contínua e faturamento direto com alíquotas fiscais automáticas.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex flex-wrap gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 shrink-0">
              <div>
                <span className="text-2xl font-black text-white block">8</span>
                <span className="text-[11px] text-emerald-200 font-medium">Departamentos</span>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <span className="text-2xl font-black text-white block">1.160+</span>
                <span className="text-[11px] text-emerald-200 font-medium">SKUs Ativos</span>
              </div>
              <div className="w-px bg-white/20" />
              <div>
                <span className="text-2xl font-black text-white block">3 CDs</span>
                <span className="text-[11px] text-emerald-200 font-medium">SP, SC e BA</span>
              </div>
            </div>
          </div>

          {/* Search Category Filter Input */}
          <div className="pt-2 max-w-xl">
            <div className="relative">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Pesquisar por categoria, equipamento ou subcategoria (ex: Notebooks, Racks, NR-17)..."
                className="w-full bg-white text-gray-900 placeholder-gray-400 text-xs font-medium py-3.5 pl-11 pr-4 rounded-2xl shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              {searchFilter && (
                <button
                  type="button"
                  onClick={() => setSearchFilter('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 underline cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 2. CATEGORIES GRID SECTION */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-12 pt-10">
        
        {/* Results Counter */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-8">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Exibindo {filteredCategories.length} de {allCategories.length} categorias corporativas
          </span>
          <Link
            href="/produtos"
            className="text-xs font-bold text-[#004e38] hover:text-[#033627] underline flex items-center gap-1"
          >
            <span>Ver catálogo unificado</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Card Top: Image + Category Badge */}
                <div className="relative aspect-[16/9] w-full bg-gray-100 overflow-hidden">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* Top Badges */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-[#004e38] shadow-md">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="bg-[#004e38]/90 text-white text-[11px] font-bold px-3 py-1 rounded-full backdrop-blur-md shadow-xs">
                      {cat.count}
                    </span>
                  </div>

                  {/* Title on Image overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
                      {cat.name}
                    </h2>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  
                  <div className="space-y-4">
                    {/* Description */}
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {cat.description}
                    </p>

                    {/* Subcategories Pills */}
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                        Subcategorias Principais:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {cat.subcategories.map((sub) => (
                          <Link
                            key={sub}
                            href={`/produtos?tipo=${encodeURIComponent(sub)}`}
                            className="bg-[#f5f6f6] hover:bg-emerald-50 hover:text-[#004e38] text-gray-700 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-colors border border-transparent hover:border-emerald-200"
                          >
                            {sub}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* B2B Specs Row */}
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="bg-gray-50 rounded-xl p-2.5">
                        <span className="text-[10px] text-gray-400 block font-medium">Lote Mínimo (MOQ)</span>
                        <strong className="text-gray-900 font-bold">{cat.moq}</strong>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-2.5">
                        <span className="text-[10px] text-gray-400 block font-medium">Benefício Fiscal</span>
                        <strong className="text-[#004e38] font-bold truncate block">{cat.taxBenefits}</strong>
                      </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                      href={`/produtos?categoria=${cat.slug}`}
                      className="w-full py-3 bg-[#004e38] hover:bg-[#033627] text-white font-bold text-xs rounded-full flex items-center justify-center gap-2 transition-all shadow-xs group/btn cursor-pointer"
                    >
                      <span>Explorar Produtos desta Categoria</span>
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8 space-y-3">
            <Search className="w-10 h-10 text-gray-300 mx-auto" />
            <h3 className="text-base font-bold text-gray-900">Nenhuma categoria encontrada</h3>
            <p className="text-xs text-gray-500">Tente buscar por outro termo ou limpe a barra de pesquisa acima.</p>
            <button
              type="button"
              onClick={() => setSearchFilter('')}
              className="bg-[#004e38] text-white text-xs font-bold px-5 py-2 rounded-full mt-2 cursor-pointer"
            >
              Ver Todas as Categorias
            </button>
          </div>
        )}

      </section>

      {/* 3. ENTERPRISE BENEFITS FOOTER BANNER */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-12 pt-16">
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 rounded-3xl p-8 lg:p-10 border border-emerald-200/60">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#004e38] text-white flex items-center justify-center shrink-0">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Faturamento a Prazo</h4>
                <p className="text-[11px] text-gray-600 mt-0.5">Boletos em 30, 60 e 90 dias com limite de crédito liberado na hora para CNPJ ativo.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#004e38] text-white flex items-center justify-center shrink-0">
                <Percent className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Escala Progressiva</h4>
                <p className="text-[11px] text-gray-600 mt-0.5">Descontos automáticos de 5% a 25% por volume de compra e pacotes departamentais.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#004e38] text-white flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Logística Multi-CD</h4>
                <p className="text-[11px] text-gray-600 mt-0.5">Expedição direta de São Paulo, Santa Catarina e Bahia com frete CIF corporativo.</p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#004e38] text-white flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-gray-900 uppercase tracking-wider">Suporte a Licitações</h4>
                <p className="text-[11px] text-gray-600 mt-0.5">Emissão de propostas técnicas formais, garantia on-site e conformidade com a Lei 14.133.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
