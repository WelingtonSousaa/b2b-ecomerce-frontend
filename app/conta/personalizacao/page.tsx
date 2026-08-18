'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Paintbrush,
  Save,
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor,
  Eye,
  Image as ImageIcon,
  Tag,
  Grid,
  Megaphone,
  Crown,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { StorefrontConfig, defaultStorefrontConfig } from '@/types/storefront';
import { useStorefront } from '@/context/StorefrontContext';
import { productsService } from '@/services/products.service';
import { Product } from '@/types/b2b';
import { useToast } from '@/context/ToastContext';

export default function PersonalizacaoLojaPage() {
  const { showToast } = useToast();
  const { config: globalConfig, updateConfig, resetConfig } = useStorefront();
  const [config, setConfig] = useState<StorefrontConfig>(globalConfig);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'brand' | 'hero' | 'products' | 'categories' | 'announcement' | 'reseller'>('brand');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isSaved, setIsSaved] = useState(false);

  React.useEffect(() => {
    productsService.getProducts().then((res) => {
      if (res.data) setCatalogProducts(res.data);
    }).catch(() => {});
  }, []);

  const handleSave = () => {
    updateConfig(config);
    setIsSaved(true);
    showToast('Vitrine personalizada publicada com sucesso! As alterações já estão visíveis.', 'success');
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    if (window.confirm('Deseja restaurar as configurações originais da vitrine?')) {
      resetConfig();
      setConfig(defaultStorefrontConfig);
      showToast('Configurações da vitrine restauradas para o padrão.', 'info');
    }
  };

  // Color Presets
  const colorPresets = [
    { name: 'Verde Shopcart (Padrão)', primary: '#004e38', accent: '#10b981' },
    { name: 'Azul Corporativo TI', primary: '#0369a1', accent: '#0284c7' },
    { name: 'Roxo Inovação Tech', primary: '#581c87', accent: '#7c3aed' },
    { name: 'Vermelho Enterprise', primary: '#991b1b', accent: '#dc2626' },
    { name: 'Preto & Titânio Premium', primary: '#18181b', accent: '#71717a' },
    { name: 'Azul Marinho & Ouro', primary: '#0f172a', accent: '#eab308' },
  ];

  // Hero Background Presets
  const heroBgPresets = [
    { name: 'Pêssego Studio', color: '#f9ece4' },
    { name: 'Esmeralda Claro', color: '#ecfdf5' },
    { name: 'Slate Escuro', color: '#0f172a' },
    { name: 'Cinza Suave', color: '#f3f4f6' },
    { name: 'Azul Gelo', color: '#f0f9ff' },
    { name: 'Branco Puro', color: '#ffffff' },
  ];

  // Hero Image Presets
  const heroImagePresets = [
    { name: 'Fones & Lifestyle', path: '/media/hero_woman.jpg' },
    { name: 'Notebook Enterprise', path: '/media/laptop_enterprise.jpg' },
    { name: 'Servidor & Datacenter', path: '/media/server_rack_nas.jpg' },
    { name: 'Mobiliário & Escritório', path: '/media/ergonomic_chair.jpg' },
    { name: 'Monitor 4K Ultrawide', path: '/media/smart_monitor_4k.jpg' },
  ];

  // Categories definition
  const availableCategories = [
    { name: 'Móveis & Escritório', slug: 'moveis-escritorio', img: '/media/ergonomic_chair.jpg' },
    { name: 'Fones & Áudio', slug: 'fones-audio', img: '/media/airpods_max_pink.jpg' },
    { name: 'Computadores & TI', slug: 'computadores-ti', img: '/media/laptop_enterprise.jpg' },
    { name: 'Redes & Servidores', slug: 'redes-servidores', img: '/media/server_rack_nas.jpg' },
    { name: 'Segurança & CFTV', slug: 'seguranca-cftv', img: '/media/security_camera.jpg' },
    { name: 'Impressão & Suprimentos', slug: 'impressao-suprimentos', img: '/media/laser_printer.jpg' },
  ];

  const selectedProducts = catalogProducts.filter((p) => config.featuredProductIds.includes(p.id));

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans text-gray-900">
      
      {/* 1. TOP HEADER & ACTIONS */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-[1700px] mx-auto px-4 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          
          {/* Breadcrumb & Title */}
          <div className="flex items-center gap-3">
            <Link
              href="/conta"
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-gray-900 tracking-tight">
                  Personalização da Vitrine B2B (Storefront Builder)
                </h1>
                <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  <Crown className="w-3 h-3" />
                  Assinatura Enterprise SaaS
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Personalize as cores, banner, departamentos e produtos da página principal da sua empresa na Shopcart.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2 rounded-full border border-gray-200 hover:bg-gray-100 text-xs font-bold text-gray-600 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrão</span>
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 rounded-full border border-gray-200 hover:bg-gray-100 text-xs font-bold text-gray-800 transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-[#004e38]" />
              <span>Ver Loja ao Vivo</span>
              <ExternalLink className="w-3 h-3 text-gray-400" />
            </Link>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2 rounded-full bg-[#004e38] hover:bg-[#033627] text-white text-xs font-black transition-all shadow-sm flex items-center gap-2 cursor-pointer hover:scale-105"
            >
              {isSaved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Alterações Publicadas!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar & Publicar Vitrine</span>
                </>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* 2. MAIN 2-PANEL LAYOUT (LEFT: CONTROLS, RIGHT: REAL-TIME SIMULATOR) */}
      <main className="max-w-[1700px] mx-auto px-4 lg:px-8 pt-6">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* LEFT PANEL: CONFIGURATION TABS (Col 5) */}
          <div className="xl:col-span-5 space-y-5">
            
            {/* Tab Navigation Pill Bar */}
            <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-xs flex flex-wrap gap-1">
              {[
                { id: 'brand', label: 'Marca & Cores', icon: Paintbrush },
                { id: 'hero', label: 'Banner Hero', icon: ImageIcon },
                { id: 'products', label: 'Produtos', icon: Tag },
                { id: 'categories', label: 'Departamentos', icon: Grid },
                { id: 'announcement', label: 'Avisos B2B', icon: Megaphone },
                { id: 'reseller', label: 'App Revendedor', icon: Smartphone },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeTab === tab.id
                        ? 'bg-[#004e38] text-white shadow-xs'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT 1: IDENTIDADE & CORES */}
            {activeTab === 'brand' && (
              <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-6 shadow-xs animate-in fade-in duration-200">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-black text-gray-900">Identidade Visual & Branding</h3>
                  <p className="text-xs text-gray-500">Defina o nome da sua empresa na vitrine, paleta cromática e link personalizado.</p>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Nome da Loja */}
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Nome de Exibição da Loja</label>
                    <input
                      type="text"
                      value={config.storeName}
                      onChange={(e) => setConfig({ ...config, storeName: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                    />
                  </div>

                  {/* Slogan */}
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Slogan ou Descrição Curta</label>
                    <input
                      type="text"
                      value={config.slogan}
                      onChange={(e) => setConfig({ ...config, slogan: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                    />
                  </div>

                  {/* Slug / Subdomínio */}
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Link Exclusivo / Subdomínio</label>
                    <div className="flex items-center rounded-xl bg-gray-50 border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-[#004e38]">
                      <span className="px-3 text-gray-400 font-mono text-[11px] bg-gray-100 border-r border-gray-200 py-2.5">
                        shopcart.com.br/loja/
                      </span>
                      <input
                        type="text"
                        value={config.storeSlug}
                        onChange={(e) => setConfig({ ...config, storeSlug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        className="w-full bg-transparent px-3 py-2 font-mono font-bold text-[#004e38] text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Paleta de Cores Prontas */}
                  <div className="pt-2">
                    <label className="font-bold text-gray-700 block mb-2">Paletas de Cores Corporativas</label>
                    <div className="grid grid-cols-2 gap-2">
                      {colorPresets.map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => setConfig({
                            ...config,
                            theme: { ...config.theme, primaryColor: preset.primary, accentColor: preset.accent }
                          })}
                          className={`p-2.5 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                            config.theme.primaryColor === preset.primary
                              ? 'border-[#004e38] bg-emerald-50/50 ring-2 ring-[#004e38]/20'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full shadow-2xs shrink-0 border border-black/10"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <span className="text-[11px] font-bold text-gray-800 line-clamp-1">{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Color Input */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Cor Primária (HEX)</label>
                      <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                        <input
                          type="color"
                          value={config.theme.primaryColor}
                          onChange={(e) => setConfig({
                            ...config,
                            theme: { ...config.theme, primaryColor: e.target.value }
                          })}
                          className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0"
                        />
                        <span className="font-mono font-bold text-[11px] text-gray-700 uppercase">
                          {config.theme.primaryColor}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Cor Secundária (HEX)</label>
                      <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                        <input
                          type="color"
                          value={config.theme.accentColor}
                          onChange={(e) => setConfig({
                            ...config,
                            theme: { ...config.theme, accentColor: e.target.value }
                          })}
                          className="w-7 h-7 rounded-lg cursor-pointer border-0 p-0"
                        />
                        <span className="font-mono font-bold text-[11px] text-gray-700 uppercase">
                          {config.theme.accentColor}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Estilo dos Cantos (Border Radius) */}
                  <div className="pt-2">
                    <label className="font-bold text-gray-700 block mb-2">Formato dos Cards da Vitrine</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Reto (Modern)', value: 'rounded-none' },
                        { label: 'Arredondado', value: 'rounded-2xl' },
                        { label: 'Ultra Suave', value: 'rounded-3xl' },
                      ].map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setConfig({
                            ...config,
                            theme: { ...config.theme, borderRadius: r.value }
                          })}
                          className={`p-2 rounded-xl text-center text-xs font-bold border transition-colors cursor-pointer ${
                            config.theme.borderRadius === r.value
                              ? 'border-[#004e38] bg-emerald-50 text-[#004e38]'
                              : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB CONTENT 2: HERO BANNER */}
            {activeTab === 'hero' && (
              <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-6 shadow-xs animate-in fade-in duration-200">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-black text-gray-900">Configuração do Hero Banner Principal</h3>
                  <p className="text-xs text-gray-500">Customize o título principal de impacto, botão de compra e imagem de estúdio.</p>
                </div>

                <div className="space-y-4 text-xs">
                  {/* Título de Impacto */}
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Título de Impacto (Headline)</label>
                    <input
                      type="text"
                      value={config.hero.headline}
                      onChange={(e) => setConfig({
                        ...config,
                        hero: { ...config.hero, headline: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                    />
                  </div>

                  {/* Subtítulo */}
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Texto de Apoio / Subtítulo</label>
                    <textarea
                      rows={2}
                      value={config.hero.subheadline}
                      onChange={(e) => setConfig({
                        ...config,
                        hero: { ...config.hero, subheadline: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium text-gray-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004e38]"
                    />
                  </div>

                  {/* Badge e Botão CTA */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Texto do Selo / Tag</label>
                      <input
                        type="text"
                        value={config.hero.badgeText}
                        onChange={(e) => setConfig({
                          ...config,
                          hero: { ...config.hero, badgeText: e.target.value }
                        })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 font-medium focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Texto do Botão CTA</label>
                      <input
                        type="text"
                        value={config.hero.ctaText}
                        onChange={(e) => setConfig({
                          ...config,
                          hero: { ...config.hero, ctaText: e.target.value }
                        })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 font-medium focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Cor de Fundo do Banner */}
                  <div>
                    <label className="font-bold text-gray-700 block mb-2">Cor de Fundo do Banner</label>
                    <div className="grid grid-cols-3 gap-2">
                      {heroBgPresets.map((bg) => (
                        <button
                          key={bg.color}
                          type="button"
                          onClick={() => setConfig({
                            ...config,
                            theme: { ...config.theme, bannerBgColor: bg.color }
                          })}
                          className={`p-2 rounded-xl border flex items-center gap-2 text-left transition-all cursor-pointer ${
                            config.theme.bannerBgColor === bg.color
                              ? 'border-[#004e38] ring-2 ring-[#004e38]/20 font-bold'
                              : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span
                            className="w-4 h-4 rounded-md border border-gray-300"
                            style={{ backgroundColor: bg.color }}
                          />
                          <span className="text-[11px] truncate">{bg.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Imagem do Banner */}
                  <div>
                    <label className="font-bold text-gray-700 block mb-2">Imagem de Destaque do Banner</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {heroImagePresets.map((img) => (
                        <button
                          key={img.path}
                          type="button"
                          onClick={() => setConfig({
                            ...config,
                            hero: { ...config.hero, heroImage: img.path }
                          })}
                          className={`p-2 rounded-2xl border text-left space-y-1.5 transition-all cursor-pointer ${
                            config.hero.heroImage === img.path
                              ? 'border-[#004e38] bg-emerald-50/50 ring-2 ring-[#004e38]/20'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-gray-100">
                            <Image src={img.path} alt={img.name} fill className="object-cover" />
                          </div>
                          <span className="text-[10px] font-bold text-gray-800 block truncate">{img.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* TAB CONTENT 3: PRODUTOS EM DESTAQUE */}
            {activeTab === 'products' && (
              <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-5 shadow-xs animate-in fade-in duration-200">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-black text-gray-900">Produtos em Destaque na Home</h3>
                  <p className="text-xs text-gray-500">Marque quais SKUs do seu catálogo corporativo devem aparecer na vitrine principal.</p>
                </div>

                <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {catalogProducts.map((prod) => {
                    const isSelected = config.featuredProductIds.includes(prod.id);
                    return (
                      <label
                        key={prod.id}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#004e38] bg-emerald-50/30'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-12 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                            <Image src={prod.images?.[0] || '/media/laptop_enterprise.jpg'} alt={prod.name} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{prod.name}</h4>
                            <span className="text-[10px] text-gray-500 font-mono">{prod.sku} • R$ {prod.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>

                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setConfig({
                                ...config,
                                featuredProductIds: [...config.featuredProductIds, prod.id]
                              });
                            } else {
                              setConfig({
                                ...config,
                                featuredProductIds: config.featuredProductIds.filter(id => id !== prod.id)
                              });
                            }
                          }}
                          className="w-4 h-4 text-[#004e38] accent-[#004e38] rounded-md"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: DEPARTAMENTOS */}
            {activeTab === 'categories' && (
              <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-5 shadow-xs animate-in fade-in duration-200">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-black text-gray-900">Departamentos & Categorias Visíveis</h3>
                  <p className="text-xs text-gray-500">Selecione quais categorias serão exibidas nos carrosséis da página inicial.</p>
                </div>

                <div className="space-y-2">
                  {availableCategories.map((cat) => {
                    const isSelected = config.featuredCategorySlugs.includes(cat.slug);
                    return (
                      <label
                        key={cat.slug}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-[#004e38] bg-emerald-50/30'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                            <Image src={cat.img} alt={cat.name} fill className="object-cover" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-gray-900">{cat.name}</h4>
                            <span className="text-[10px] text-gray-400">slug: {cat.slug}</span>
                          </div>
                        </div>

                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setConfig({
                                ...config,
                                featuredCategorySlugs: [...config.featuredCategorySlugs, cat.slug]
                              });
                            } else {
                              setConfig({
                                ...config,
                                featuredCategorySlugs: config.featuredCategorySlugs.filter(s => s !== cat.slug)
                              });
                            }
                          }}
                          className="w-4 h-4 text-[#004e38] accent-[#004e38] rounded-md"
                        />
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB CONTENT 5: COMUNICADOS B2B */}
            {activeTab === 'announcement' && (
              <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-5 shadow-xs animate-in fade-in duration-200">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-black text-gray-900">Barra de Comunicados Superior</h3>
                  <p className="text-xs text-gray-500">Exiba avisos de frete CIF, benefícios tributários ou prazos de faturamento no topo da loja.</p>
                </div>

                <div className="space-y-4 text-xs">
                  <label className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-200 cursor-pointer">
                    <div>
                      <span className="font-bold text-gray-900 block">Exibir Barra de Comunicados</span>
                      <span className="text-gray-500 text-[11px]">Faixa visível no topo de todas as páginas da sua loja</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={config.announcement.enabled}
                      onChange={(e) => setConfig({
                        ...config,
                        announcement: { ...config.announcement, enabled: e.target.checked }
                      })}
                      className="w-4 h-4 accent-[#004e38]"
                    />
                  </label>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Texto do Comunicado</label>
                    <input
                      type="text"
                      value={config.announcement.text}
                      onChange={(e) => setConfig({
                        ...config,
                        announcement: { ...config.announcement, text: e.target.value }
                      })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2.5 font-medium focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Texto do Link</label>
                      <input
                        type="text"
                        value={config.announcement.linkText}
                        onChange={(e) => setConfig({
                          ...config,
                          announcement: { ...config.announcement, linkText: e.target.value }
                        })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 font-medium focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-gray-700 block mb-1">URL de Destino</label>
                      <input
                        type="text"
                        value={config.announcement.linkUrl}
                        onChange={(e) => setConfig({
                          ...config,
                          announcement: { ...config.announcement, linkUrl: e.target.value }
                        })}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-2 font-medium focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 6: APP REVENDEDOR & ASSINATURA */}
            {activeTab === 'reseller' && (
              <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-5 shadow-xs animate-in fade-in duration-200">
                <div className="border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-black text-gray-900">App Mobile de Revendedores & Assinatura</h3>
                  <p className="text-xs text-gray-500">Configuração de APIs e permissões para o ecossistema de revendedores oficiais da sua marca.</p>
                </div>

                <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-3">
                  <div className="flex items-center gap-2 text-purple-900">
                    <Crown className="w-5 h-5 text-purple-700" />
                    <span className="text-xs font-black uppercase tracking-wider">Plano SaaS Ativo: {config.subscriptionPlan}</span>
                  </div>
                  <p className="text-xs text-purple-800 leading-relaxed">
                    Sua empresa possui contrato de assinatura ativo com taxa reduzida sobre faturamento B2B e acesso liberado a endpoints de integração.
                  </p>
                </div>

                <label className="flex items-center justify-between p-4 rounded-2xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs text-gray-900 block">
                      Habilitar Acesso para App Mobile de Revendedores
                    </span>
                    <span className="text-[11px] text-gray-500 block">
                      Gera credenciais seguras de API para seus representantes emitirem pedidos de qualquer lugar pelo celular.
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.allowResellerMobileApp}
                    onChange={(e) => setConfig({
                      ...config,
                      allowResellerMobileApp: e.target.checked
                    })}
                    className="w-4 h-4 accent-purple-700"
                  />
                </label>
              </div>
            )}

          </div>

          {/* RIGHT PANEL: LIVE INTERACTIVE STOREFRONT SIMULATOR (Col 7) */}
          <div className="xl:col-span-7 space-y-3 sticky top-20">
            
            {/* Device Switcher Bar */}
            <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-2xl border border-gray-200 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-600">
                <Eye className="w-4 h-4 text-[#004e38]" />
                <span>Simulador da Vitrine em Tempo Real</span>
              </div>

              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewDevice === 'desktop' ? 'bg-white shadow-xs text-[#004e38]' : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title="Visualização Desktop"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewDevice === 'tablet' ? 'bg-white shadow-xs text-[#004e38]' : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title="Visualização Tablet"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    previewDevice === 'mobile' ? 'bg-white shadow-xs text-[#004e38]' : 'text-gray-500 hover:text-gray-900'
                  }`}
                  title="Visualização Celular"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* BROWSER MOCKUP CONTAINER */}
            <div className="bg-gray-800 rounded-3xl p-3 shadow-2xl border border-gray-700 flex justify-center">
              
              <div
                className={`bg-white transition-all duration-300 overflow-hidden shadow-inner flex flex-col ${
                  config.theme.borderRadius
                } ${
                  previewDevice === 'desktop'
                    ? 'w-full min-h-[620px]'
                    : previewDevice === 'tablet'
                    ? 'w-[540px] min-h-[620px]'
                    : 'w-[360px] min-h-[620px]'
                }`}
              >
                
                {/* Simulated Announcement Bar */}
                {config.announcement.enabled && (
                  <div
                    className="text-white text-[10px] py-1.5 px-3 text-center font-bold flex items-center justify-center gap-2 shrink-0 transition-colors"
                    style={{ backgroundColor: config.theme.primaryColor }}
                  >
                    <span>{config.announcement.text}</span>
                    {config.announcement.linkText && (
                      <span className="underline opacity-90">{config.announcement.linkText}</span>
                    )}
                  </div>
                )}

                {/* Simulated Header Navbar */}
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-black shadow-xs"
                      style={{ backgroundColor: config.theme.primaryColor }}
                    >
                      S
                    </div>
                    <div>
                      <h4 className="text-xs font-black tracking-tight" style={{ color: config.theme.primaryColor }}>
                        {config.storeName}
                      </h4>
                      <span className="text-[8px] text-gray-400 font-bold uppercase block">{config.slogan}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-500 hidden sm:inline">Categorias</span>
                    <span className="text-[10px] font-bold text-gray-500 hidden sm:inline">Ofertas</span>
                    <span
                      className="text-[9px] font-bold text-white px-2 py-1 rounded-full"
                      style={{ backgroundColor: config.theme.primaryColor }}
                    >
                      B2B Ativo
                    </span>
                  </div>
                </div>

                {/* Simulated Main Body Content */}
                <div className="p-4 space-y-6 overflow-y-auto max-h-[500px]">
                  
                  {/* SIMULATED HERO BANNER */}
                  <div
                    className={`p-6 flex flex-col md:flex-row items-center justify-between gap-4 relative overflow-hidden transition-colors ${config.theme.borderRadius}`}
                    style={{ backgroundColor: config.theme.bannerBgColor }}
                  >
                    <div className="space-y-3 z-10 max-w-sm">
                      {config.hero.showBadge && (
                        <span
                          className="inline-block text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full text-white shadow-2xs"
                          style={{ backgroundColor: config.theme.primaryColor }}
                        >
                          {config.hero.badgeText}
                        </span>
                      )}
                      
                      <h2
                        className="text-xl sm:text-2xl font-black tracking-tight leading-tight"
                        style={{ color: config.theme.primaryColor }}
                      >
                        {config.hero.headline}
                      </h2>

                      <p className="text-[11px] text-gray-600 leading-snug">
                        {config.hero.subheadline}
                      </p>

                      <button
                        type="button"
                        className="px-5 py-2 text-white text-xs font-black rounded-full shadow-xs cursor-pointer"
                        style={{ backgroundColor: config.theme.primaryColor }}
                      >
                        {config.hero.ctaText}
                      </button>
                    </div>

                    <div className="relative w-36 h-36 shrink-0 rounded-2xl overflow-hidden shadow-md">
                      <Image
                        src={config.hero.heroImage}
                        alt="Hero Banner Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* SIMULATED CATEGORIES STRIP */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-gray-900">Departamentos</h4>
                      <span className="text-[10px] text-gray-400 font-bold">Ver todos</span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                      {availableCategories
                        .filter(c => config.featuredCategorySlugs.includes(c.slug))
                        .slice(0, 6)
                        .map(cat => (
                          <div key={cat.slug} className="text-center p-2 rounded-xl bg-gray-50 border border-gray-100">
                            <div className="relative w-8 h-8 mx-auto rounded-lg overflow-hidden mb-1">
                              <Image src={cat.img} alt={cat.name} fill className="object-cover" />
                            </div>
                            <span className="text-[9px] font-bold text-gray-800 block truncate">{cat.name}</span>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* SIMULATED FEATURED PRODUCTS GRID */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-gray-900">Produtos em Destaque</h4>
                      <span className="text-[10px] font-bold" style={{ color: config.theme.primaryColor }}>
                        {selectedProducts.length} itens ativos
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {selectedProducts.slice(0, 4).map((prod) => (
                        <div
                          key={prod.id}
                          className={`bg-white border border-gray-100 p-2.5 space-y-1.5 shadow-2xs ${config.theme.borderRadius}`}
                        >
                          <div className="relative aspect-square w-full rounded-xl bg-gray-50 overflow-hidden">
                            <Image src={prod.images?.[0] || '/media/laptop_enterprise.jpg'} alt={prod.name} fill className="object-cover" />
                          </div>
                          <h5 className="text-[10px] font-bold text-gray-900 line-clamp-1">{prod.name}</h5>
                          <span
                            className="text-xs font-black block"
                            style={{ color: config.theme.primaryColor }}
                          >
                            R$ {prod.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </main>

    </div>
  );
}
