'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  ShoppingCart,
  ChevronDown,
  Menu,
  X,
  Headphones,
  Laptop,
  Building2,
  Lock,
  LogOut,
  Edit3,
  Boxes,
  LayoutGrid,
  ArrowRight
} from 'lucide-react';
import HeaderTopBar from '@/components/layout/HeaderTopBar';
import CartDrawer from '@/components/cart/CartDrawer';
import NotificationDropdown from '@/components/layout/NotificationDropdown';
import { productsService } from '@/services/products.service';
import { Product } from '@/types/b2b';
import { useAuth } from '@/context/AuthContext';

interface HeaderNavbarProps {
  cartCount?: number;
}

export default function HeaderNavbar({ cartCount = 2 }: HeaderNavbarProps) {
  const { user, company, isAuthenticated, logout, openAuthModal, openEditCompanyModal } = useAuth();

  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    productsService.getProducts().then((res) => {
      if (res.data) {
        setAllProducts(res.data);
      }
    }).catch(() => {});
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories = [
    { name: 'Fones & Áudio', slug: 'fones-audio', icon: Headphones, count: '240 itens' },
    { name: 'Computadores & Laptops', slug: 'computadores-ti', icon: Laptop, count: '180 itens' },
    { name: 'Redes & Servidores', slug: 'redes-servidores', icon: Boxes, count: '120 itens' },
    { name: 'Monitores Corporativos', slug: 'monitores', icon: Laptop, count: '95 itens' },
  ];

  const filteredProducts = searchQuery.trim()
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allProducts.slice(0, 4);

  const handleCartClick = () => {
    if (!isAuthenticated) {
      openAuthModal('Para acessar o carrinho de compras e ver preços faturados por CNPJ, por favor acesse sua conta ou cadastre sua empresa.');
    } else {
      setIsCartOpen(true);
    }
  };

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      openAuthModal('Para acessar sua conta corporativa e consultar limite de crédito, faça login ou cadastre sua empresa.');
    } else {
      setIsAccountMenuOpen(!isAccountMenuOpen);
    }
  };

  return (
    <>
      {/* Top Green Notification Bar */}
      <HeaderTopBar />

      {/* Main Header Row */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 font-sans shadow-xs">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-12 h-20 flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-[#004e38] transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo: Shopcart (Cart Icon + Brand Name) */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="relative w-8 h-8 flex items-center justify-center text-[#004e38]">
              <div className="w-7 h-7 rounded-lg bg-[#004e38] text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                <ShoppingCart className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full border border-white"></span>
            </div>
            <span className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-0.5">
              Shopcart
            </span>
          </Link>

          {/* Guest vs Authenticated Status Badge (Purely Visual when Authenticated) */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 bg-emerald-50 text-[#004e38] px-3.5 py-1.5 rounded-full border border-emerald-200 text-xs font-bold select-none">
                {company?.logoUrl ? (
                  <div className="w-5 h-5 rounded-full bg-white relative overflow-hidden border border-emerald-300 shrink-0">
                    <Image src={company.logoUrl} alt="" fill className="object-contain p-0.5" />
                  </div>
                ) : (
                  <Building2 className="w-4 h-4 text-[#004e38]" />
                )}
                <span className="truncate max-w-[150px]">{company?.nomeFantasia}</span>
                <span className="bg-[#004e38] text-white text-[9px] px-1.5 py-0.5 rounded font-mono">CNPJ OK</span>
              </div>
            ) : (
              <button
                onClick={() => openAuthModal('Você está no Modo Visitante. Entre com seu CNPJ para desbloquear preços e faturamento.')}
                className="flex items-center gap-2 bg-[#f5f6f6] hover:bg-gray-200 text-gray-700 px-3.5 py-1.5 rounded-full border border-gray-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Modo Visitante (Preços Ocultos)</span>
                <span className="bg-[#004e38] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Entrar</span>
              </button>
            )}
          </div>

          {/* Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-gray-800 shrink-0">
            {/* Categories Dropdown */}
            <div className="relative" ref={categoriesRef}>
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="flex items-center gap-1.5 hover:text-[#004e38] transition-colors py-2 cursor-pointer"
              >
                <span>Categorias</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isCategoriesOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoriesOpen && (
                <div className="absolute left-0 mt-3 w-64 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-100 py-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Categorias em Destaque
                  </div>
                  {categories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <Link
                        key={cat.slug}
                        href={`/produtos?categoria=${cat.slug}`}
                        onClick={() => setIsCategoriesOpen(false)}
                        className="flex items-center justify-between px-4 py-2.5 hover:bg-[#f5f6f6] hover:text-[#004e38] transition-colors text-xs font-semibold text-gray-700"
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4 text-gray-500" />
                          <span>{cat.name}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-normal">{cat.count}</span>
                      </Link>
                    );
                  })}
                  
                  {/* Ver Todas as Categorias CTA */}
                  <div className="border-t border-gray-100 mt-2 pt-2 px-2">
                    <Link
                      href="/categorias"
                      onClick={() => setIsCategoriesOpen(false)}
                      className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-emerald-50 hover:bg-[#004e38] text-[#004e38] hover:text-white transition-all text-xs font-bold group"
                    >
                      <div className="flex items-center gap-2.5">
                        <LayoutGrid className="w-4 h-4" />
                        <span>Ver Todas as Categorias</span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link href="/produtos?deals=true" className="hover:text-[#004e38] transition-colors py-2">
              Ofertas
            </Link>

            <Link href="/produtos?new=true" className="hover:text-[#004e38] transition-colors py-2">
              Novidades
            </Link>

            <Link href="/produtos" className="hover:text-[#004e38] transition-colors py-2">
              Todos os Produtos
            </Link>
          </nav>

          {/* Search Input Bar */}
          <div className="flex-1 max-w-md hidden md:block relative" ref={searchRef}>
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Pesquisar produto..."
                className="w-full bg-[#f5f6f6] hover:bg-gray-100 focus:bg-white text-xs font-medium text-gray-900 placeholder-gray-400 rounded-full py-2.5 pl-5 pr-11 focus:outline-none focus:ring-2 focus:ring-[#004e38] transition-all"
              />
              <button
                type="button"
                className="absolute right-3 text-gray-500 hover:text-[#004e38] transition-colors p-1"
              >
                <Search className="w-4 h-4 stroke-[2.2]" />
              </button>
            </div>

            {/* Live Autocomplete Results */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 mt-2 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 bg-gray-50 border-b border-gray-100 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Resultados da Busca
                </div>
                <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((prod) => (
                      <Link
                        key={prod.id}
                        href={`/produto/${prod.sku}`}
                        onClick={() => setIsSearchFocused(false)}
                        className="flex items-center justify-between p-3 hover:bg-[#f5f6f6] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#f5f6f6] p-1 flex items-center justify-center shrink-0">
                            <Image src={(prod.images && prod.images[0]) || '/media/img1.jpeg'} alt={prod.name} width={36} height={36} className="object-contain max-h-8" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-900 line-clamp-1">{prod.name}</p>
                            <p className="text-[10px] text-gray-400 font-mono">{prod.sku}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-[#004e38] shrink-0 pl-2">
                          {isAuthenticated ? `R$ ${prod.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '🔒 Sob Consulta'}
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-gray-500">
                      Nenhum produto encontrado.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Corporate Corporate Account Action Button */}
          <div className="flex items-center gap-6 shrink-0 text-xs font-bold text-gray-900">
            
            {/* Account Button */}
            <div className="relative">
              <button
                onClick={handleAccountClick}
                className="flex items-center gap-2 hover:text-[#004e38] transition-colors py-2 cursor-pointer"
              >
                {/* Corporate Building Icon instead of Generic User Icon */}
                <div className="w-8 h-8 rounded-full bg-[#f5f6f6] hover:bg-emerald-50 text-[#004e38] flex items-center justify-center shrink-0 border border-gray-200 transition-colors">
                  {company?.logoUrl ? (
                    <Image src={company.logoUrl} alt="" width={24} height={24} className="object-contain rounded-full" />
                  ) : (
                    <Building2 className="w-4 h-4 stroke-[2]" />
                  )}
                </div>

                <span className="hidden sm:inline">
                  {isAuthenticated ? (company?.nomeFantasia || user?.name.split(' ')[0]) : 'Empresa / Entrar'}
                </span>
              </button>

              {/* Corporate Account Dropdown Menu */}
              {isAccountMenuOpen && isAuthenticated && (
                <div className="absolute right-0 mt-2 w-64 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-gray-100 bg-[#f5f6f6]/60">
                    <p className="text-xs font-black text-[#004e38] line-clamp-1">{company?.nomeFantasia}</p>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">{company?.cnpj}</p>
                    {company?.industrySegment && (
                      <span className="inline-block bg-white text-gray-600 text-[9px] font-bold px-2 py-0.5 rounded border border-gray-200 mt-1">
                        {company.industrySegment}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setIsAccountMenuOpen(false);
                      openEditCompanyModal();
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-[#f5f6f6] hover:text-[#004e38] font-bold text-xs flex items-center gap-2 border-b border-gray-50 text-gray-800 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-[#004e38]" />
                    <span>Editar Informações da Empresa</span>
                  </button>

                  <Link href="/conta" onClick={() => setIsAccountMenuOpen(false)} className="block px-4 py-2 hover:bg-[#f5f6f6] hover:text-[#004e38]">
                    Painel da Empresa
                  </Link>

                  <Link href="/conta/tabelas-de-precos" onClick={() => setIsAccountMenuOpen(false)} className="block px-4 py-2 hover:bg-[#f5f6f6] hover:text-[#004e38]">
                    Tabelas de Preços Negociadas (Price Books)
                  </Link>

                  <Link href="/conta/rma" onClick={() => setIsAccountMenuOpen(false)} className="block px-4 py-2 hover:bg-[#f5f6f6] hover:text-[#004e38]">
                    RMA & Devoluções de Lotes
                  </Link>

                  <Link href="/conta/contratos" onClick={() => setIsAccountMenuOpen(false)} className="block px-4 py-2 hover:bg-[#f5f6f6] hover:text-[#004e38]">
                    Contratos de Fornecimento B2B
                  </Link>

                  <Link href="/conta/integracoes" onClick={() => setIsAccountMenuOpen(false)} className="block px-4 py-2 hover:bg-[#f5f6f6] hover:text-[#004e38]">
                    Monitor de ERPs & Webhooks
                  </Link>

                  <Link href="/conta/estoque" onClick={() => setIsAccountMenuOpen(false)} className="block px-4 py-2 hover:bg-[#f5f6f6] text-[#004e38] font-extrabold flex items-center justify-between">
                    <span>Gestão de Estoque (Vendedor)</span>
                    <Boxes className="w-4 h-4 text-[#004e38]" />
                  </Link>

                  <Link href="/conta/pedidos" onClick={() => setIsAccountMenuOpen(false)} className="block px-4 py-2 hover:bg-[#f5f6f6] hover:text-[#004e38]">
                    Meus Pedidos & Faturas
                  </Link>

                  <Link href="/quick-order" onClick={() => setIsAccountMenuOpen(false)} className="block px-4 py-2 hover:bg-[#f5f6f6] hover:text-[#004e38]">
                    Pedido Rápido (CSV)
                  </Link>

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => { logout(); setIsAccountMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-bold flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sair do CNPJ</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell (Enterprise B2B) */}
            {isAuthenticated && (
              <NotificationDropdown />
            )}

            {/* Cart Button */}
            <button
              onClick={handleCartClick}
              className="flex items-center gap-2 hover:text-[#004e38] transition-colors py-2 cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-gray-800" />
                {cartCount > 0 && isAuthenticated && (
                  <span className="absolute -top-1.5 -right-2 bg-[#004e38] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Carrinho</span>
            </button>

          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-xl">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar produto..."
                className="w-full bg-[#f5f6f6] text-xs font-medium rounded-full py-2.5 pl-4 pr-10 focus:outline-none"
              />
              <Search className="w-4 h-4 text-gray-400 absolute right-3 top-3" />
            </div>

            <div className="space-y-2 text-xs font-bold text-gray-800 pt-2">
              <Link href="/categorias" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-gray-50">
                Todas as Categorias
              </Link>
              <Link href="/produtos?deals=true" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-gray-50">
                Ofertas
              </Link>
              <Link href="/produtos?new=true" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-gray-50">
                Novidades
              </Link>
              <Link href="/produtos" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-gray-50">
                Todos os Produtos
              </Link>
              {isAuthenticated && (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    openEditCompanyModal();
                  }}
                  className="w-full text-left py-2 text-[#004e38] font-extrabold flex items-center gap-2 cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Editar Informações da Empresa</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Cart Slideover Component */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
