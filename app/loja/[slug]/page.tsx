'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ShieldCheck,
  Star,
  Search,
  Download,
  FileCheck2,
  Truck,
  Boxes,
  Check
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { productsService } from '@/services/products.service';
import { Product } from '@/types/b2b';

interface StoreData {
  slug: string;
  name: string;
  legalName: string;
  cnpj: string;
  segment: string;
  rating: number;
  reviewsCount: number;
  activeContracts: number;
  leadTime: string;
  primaryColor: string;
  bannerBgColor: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroImage: string;
  logoUrl?: string;
  allowedCategories: string[];
}

const storesData: Record<string, StoreData> = {
  'dell-enterprise': {
    slug: 'dell-enterprise',
    name: 'Dell Technologies Enterprise',
    legalName: 'Dell Computadores do Brasil LTDA',
    cnpj: '72.381.189/0001-10',
    segment: 'Computadores, Servidores & Estações de Trabalho',
    rating: 4.9,
    reviewsCount: 340,
    activeContracts: 89,
    leadTime: 'Expedição em 24h CD-SP',
    primaryColor: '#0076ce',
    bannerBgColor: '#e0f2fe',
    heroHeadline: 'Infraestrutura de TI & Laptops Corporativos Dell',
    heroSubheadline: 'Notebooks Latitude, Workstations Precision e Servidores PowerEdge com garantia on-site ProSupport.',
    heroImage: '/media/laptop_enterprise.jpg',
    allowedCategories: ['computadores-ti', 'monitores'],
  },
  'poly-audio': {
    slug: 'poly-audio',
    name: 'Poly (Plantronics & HP) Enterprise Audio',
    legalName: 'Polycom Brasil Soluções de Voz LTDA',
    cnpj: '03.892.481/0001-44',
    segment: 'Áudio Profissional, Headsets & Videoconferência',
    rating: 5.0,
    reviewsCount: 215,
    activeContracts: 142,
    leadTime: 'Pronta entrega CD-SP / CD-SC',
    primaryColor: '#004e38',
    bannerBgColor: '#f9ece4',
    heroHeadline: 'Comunicação Unificada & Headsets para Call Centers',
    heroSubheadline: 'Cancelamento de ruído híbrido ANC com homologação Microsoft Teams e Zoom Rooms.',
    heroImage: '/media/corporate_headset.jpg',
    allowedCategories: ['fones-audio'],
  },
  'synology-brasil': {
    slug: 'synology-brasil',
    name: 'Synology Enterprise Storage',
    legalName: 'Synology Distribuição Corporativa Brasil',
    cnpj: '18.940.112/0001-89',
    segment: 'Servidores NAS, Backup Imutável & Datacenter',
    rating: 4.8,
    reviewsCount: 98,
    activeContracts: 45,
    leadTime: 'Pronta entrega CD-SC',
    primaryColor: '#0f172a',
    bannerBgColor: '#f1f5f9',
    heroHeadline: 'Storages NAS Corporativos e Soluções de Backup 3-2-1',
    heroSubheadline: 'Sistemas NAS escaláveis com gavetas hot-swap, proteção contra ransomware e suporte técnico direto.',
    heroImage: '/media/server_rack_nas.jpg',
    allowedCategories: ['redes-servidores'],
  },
};

export default function StorefrontPublicPage() {
  const params = useParams();
  const slug = (params?.slug as string) || 'dell-enterprise';
  const { isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  React.useEffect(() => {
    productsService.getProducts()
      .then((res) => {
        if (res.data) {
          setProducts(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Fallback to custom/default store if slug doesn't match predefined
  const store: StoreData = storesData[slug] || {
    slug,
    name: `Loja Oficial ${slug.replace(/-/g, ' ').toUpperCase()}`,
    legalName: `${slug.replace(/-/g, ' ').toUpperCase()} Distribuidora B2B LTDA`,
    cnpj: '12.345.678/0001-90',
    segment: 'Distribuição B2B e Soluções Corporativas',
    rating: 4.9,
    reviewsCount: 120,
    activeContracts: 38,
    leadTime: 'Pronta entrega CD-SP',
    primaryColor: '#004e38',
    bannerBgColor: '#f9ece4',
    heroHeadline: `Catálogo Oficial ${slug.replace(/-/g, ' ').toUpperCase()}`,
    heroSubheadline: 'Fornecimento corporativo direto da fábrica com faturamento por boleto 30/60/90 dias.',
    heroImage: '/media/laptop_enterprise.jpg',
    allowedCategories: ['computadores-ti', 'fones-audio', 'redes-servidores'],
  };

  // Filter products belonging to this store's category or search
  const storeProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          prod.sku.toLowerCase().includes(searchTerm.toLowerCase());
    if (selectedCategory === 'ALL') return matchesSearch;
    return matchesSearch && prod.categorySlug === selectedCategory;
  });

  const handleAddToCart = (id: string, name: string) => {
    if (!isAuthenticated) {
      openAuthModal('Para adicionar itens ao carrinho e faturar por CNPJ, acesse sua conta.');
      return;
    }
    setAddedItems(prev => ({ ...prev, [id]: true }));
    showToast(`${name} adicionado ao carrinho da loja oficial!`, 'success');
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const handleDownloadPriceBook = () => {
    const csvHeader = 'SKU;Produto;NCM;Preco_Base_B2B;Lote_Minimo_MOQ;Estoque_Total\n';
    const csvBody = storeProducts.map(p => 
      `${p.sku};${p.name};${p.ncm};R$ ${p.basePrice.toFixed(2)};${p.moq} un;${p.stockByCD.reduce((acc, c) => acc + c.availableQuantity, 0)} un`
    ).join('\n');
    const blob = new Blob([csvHeader + csvBody], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Tabela_Precos_${store.slug}_B2B.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Tabela de Preços Oficial baixada com sucesso!', 'info');
  };

  return (
    <div className="bg-[#fcfdfd] min-h-screen pb-20 font-sans">
      
      {/* 1. STORE BRAND HEADER */}
      <section className="bg-white border-b border-gray-100 shadow-2xs py-6 px-4 lg:px-12">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-3xl flex items-center justify-center text-white font-black text-2xl shadow-sm shrink-0"
              style={{ backgroundColor: store.primaryColor }}
            >
              {store.name.charAt(0)}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  {store.name}
                </h1>
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-black px-2.5 py-0.5 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Fornecedor Oficial Homologado
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-medium">
                <span>CNPJ: <strong className="font-mono text-gray-800">{store.cnpj}</strong></span>
                <span>•</span>
                <span>{store.segment}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  {store.rating} ({store.reviewsCount} avaliações)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleDownloadPriceBook}
              className="px-4 py-2.5 rounded-full border border-gray-200 hover:bg-gray-50 text-xs font-bold text-gray-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4 text-gray-500" />
              <span>Baixar Tabela de Preços (CSV)</span>
            </button>

            <Link
              href="/cotacoes"
              className="px-5 py-2.5 rounded-full text-white text-xs font-black transition-all shadow-xs flex items-center gap-2 hover:scale-105 cursor-pointer"
              style={{ backgroundColor: store.primaryColor }}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Solicitar Contrato B2B</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 2. STORE HERO BANNER */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-12 pt-6">
        <div
          className="rounded-3xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-xs"
          style={{ backgroundColor: store.bannerBgColor }}
        >
          <div className="max-w-xl space-y-4 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 text-gray-900 text-xs font-bold backdrop-blur-xs">
              <Boxes className="w-3.5 h-3.5" style={{ color: store.primaryColor }} />
              <span>Vitrine Exclusiva Direto da Fábrica</span>
            </div>

            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight"
              style={{ color: store.primaryColor }}
            >
              {store.heroHeadline}
            </h2>

            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
              {store.heroSubheadline}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-bold text-gray-800">
              <span className="flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-xl border border-black/5">
                <Truck className="w-4 h-4 text-emerald-600" />
                {store.leadTime}
              </span>
              <span className="flex items-center gap-1.5 bg-white/70 px-3 py-1.5 rounded-xl border border-black/5">
                <FileCheck2 className="w-4 h-4 text-blue-600" />
                {store.activeContracts} Contratos Ativos
              </span>
            </div>
          </div>

          <div className="relative w-full md:w-1/2 aspect-[4/3] max-w-md shrink-0 rounded-2xl overflow-hidden shadow-lg">
            <Image
              src={store.heroImage}
              alt={store.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* 3. STORE SEARCH & PRODUCT CATALOG */}
      <section className="max-w-[1440px] mx-auto px-4 lg:px-12 pt-10 space-y-6">
        
        {/* Search & Filter Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-100 shadow-2xs">
          
          {/* Search */}
          <div className="relative flex-1 w-full max-w-md">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Pesquisar no catálogo da ${store.name}...`}
              className="w-full bg-[#f5f6f6] rounded-full py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <button
              type="button"
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === 'ALL'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Todos
            </button>
            {store.allowedCategories.map((catSlug) => (
              <button
                key={catSlug}
                type="button"
                onClick={() => setSelectedCategory(catSlug)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === catSlug
                    ? 'text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                style={{ backgroundColor: selectedCategory === catSlug ? store.primaryColor : undefined }}
              >
                {catSlug.replace('-', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          {/* Results count */}
          <div className="text-xs font-bold text-gray-500">
            Exibindo <strong>{storeProducts.length}</strong> produtos
          </div>

        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {storeProducts.map((prod) => {
            const isAdded = addedItems[prod.id];
            const totalStock = prod.stockByCD.reduce((acc, c) => acc + c.availableQuantity, 0);

            return (
              <div
                key={prod.id}
                className="bg-white rounded-3xl border border-gray-100 p-5 space-y-4 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="relative aspect-square w-full bg-[#f5f6f6] rounded-2xl overflow-hidden p-4 flex items-center justify-center">
                    <Image
                      src={prod.images?.[0] || '/media/laptop_enterprise.jpg'}
                      alt={prod.name}
                      fill
                      className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-gray-700 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md shadow-2xs">
                      {prod.sku}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold text-gray-900 group-hover:text-[#004e38] transition-colors line-clamp-2">
                      {prod.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 mt-1 line-clamp-1">{prod.description}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-gray-100">
                  <div className="flex items-end justify-between">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-medium">Lote Mínimo: {prod.moq} un.</span>
                      {isAuthenticated ? (
                        <strong className="text-sm font-black text-[#004e38]">
                          R$ {prod.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </strong>
                      ) : (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          🔒 Preço Oculto
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] text-gray-500 font-bold">
                      {totalStock} un. em estoque
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/produto/${prod.sku}`}
                      className="py-2 px-3 rounded-full text-center text-xs font-bold border border-gray-200 hover:bg-gray-50 text-gray-700 transition-colors"
                    >
                      Ver Detalhes
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleAddToCart(prod.id, prod.name)}
                      className={`py-2 px-3 rounded-full text-center text-xs font-bold text-white transition-all cursor-pointer flex items-center justify-center gap-1 ${
                        isAdded ? 'bg-emerald-700' : 'hover:opacity-90'
                      }`}
                      style={{ backgroundColor: isAdded ? undefined : store.primaryColor }}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Adicionado</span>
                        </>
                      ) : (
                        <span>Comprar</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </section>

    </div>
  );
}
