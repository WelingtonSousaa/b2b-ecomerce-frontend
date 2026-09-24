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
import CartDrawer from '@/components/cart/CartDrawer';
import NotificationDropdown from '@/components/layout/NotificationDropdown';
import { Product } from '@/types/b2b';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { mockProducts } from '@/mocks/mockProducts';

interface HeaderNavbarProps {
  cartCount?: number;
}

export default function HeaderNavbar({ cartCount: propCartCount }: HeaderNavbarProps) {
  const { user, company, isAuthenticated, login, logout, openAuthModal } = useAuth();
  const { isCartOpen, openCart, closeCart, totalItemsCount } = useCart();

  const cartCount = propCartCount !== undefined ? propCartCount : totalItemsCount;

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAllProducts(mockProducts as any);
  }, []);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const filteredProducts = searchQuery.trim()
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allProducts.slice(0, 4);

  const handleCartClick = () => {
    openCart();
  };

  const handleAccountClick = () => {
    if (!isAuthenticated) {
      login();
    } else {
      setIsAccountMenuOpen(!isAccountMenuOpen);
    }
  };

  return (
    <>
      {/* Main Header Row */}
      <header className="sticky top-0 z-40 bg-white font-sans shadow-sm">
        <div className="w-full px-4 lg:px-8 h-20 flex items-center justify-between gap-4 lg:gap-8">
          
          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-700 hover:text-[#2563eb] transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex items-center shrink-0 group relative h-10 w-32 sm:w-40">
            <Image 
              src="/logo.png" 
              alt="Logo" 
              fill
              className="object-contain object-left group-hover:scale-105 transition-transform" 
            />
          </Link>

          {/* Guest vs Authenticated Status Badge (Purely Visual when Authenticated) */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 bg-blue-50 text-[#2563eb] px-3.5 py-1.5 rounded-full border border-blue-200 text-xs font-bold select-none">
                {company?.logoUrl ? (
                  <div className="w-5 h-5 rounded-full bg-white relative overflow-hidden border border-blue-300 shrink-0">
                    <Image src={company.logoUrl} alt="" fill className="object-contain p-0.5" />
                  </div>
                ) : (
                  <Building2 className="w-4 h-4 text-[#2563eb]" />
                )}
                <span className="truncate max-w-[150px]">{company?.nomeFantasia}</span>
                <span className="bg-[#2563eb] text-white text-[9px] px-1.5 py-0.5 rounded font-mono">CNPJ OK</span>
              </div>
            ) : (
              <button
                onClick={() => login()}
                className="flex items-center gap-2 bg-[#f5f6f6] hover:bg-gray-200 text-gray-700 px-3.5 py-1.5 rounded-full border border-gray-200 text-xs font-semibold transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Modo Visitante (Preços Ocultos)</span>
                <span className="bg-[#2563eb] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Entrar</span>
              </button>
            )}
          </div>

          {/* Search Input Bar */}
          <div className="flex-1 max-w-3xl hidden md:block relative mx-auto" ref={searchRef}>
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                placeholder="Pesquisar produto..."
                className="w-full bg-[#f5f6f6] hover:bg-gray-100 focus:bg-white text-xs font-medium text-gray-900 placeholder-gray-400 rounded-full py-2.5 pl-5 pr-11 focus:outline-none focus:ring-2 focus:ring-[#2563eb] transition-all"
              />
              <button
                type="button"
                className="absolute right-3 text-gray-500 hover:text-[#2563eb] transition-colors p-1"
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
                        <span className="text-xs font-black text-[#2563eb] shrink-0 pl-2">
                          {isAuthenticated ? `R$ ${prod.basePrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Sob Consulta'}
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
            
            {/* Contato Comercial Rapido */}
            <div className="hidden lg:flex flex-col items-end justify-center text-gray-800">
              <span className="text-[9px] text-gray-500 font-semibold uppercase tracking-wider">Contato Comercial</span>
              <a href="tel:08001234567" className="flex items-center gap-1 hover:text-[#2563eb] transition-colors font-bold text-xs mt-0.5">
                <Headphones className="w-3.5 h-3.5" />
                0800 123 4567
              </a>
            </div>
            
            {/* Account Button */}
            <div className="relative">
              <button
                onClick={handleAccountClick}
                className="flex items-center gap-2 hover:text-[#2563eb] transition-colors py-2 cursor-pointer"
              >
                {/* Corporate Building Icon instead of Generic User Icon */}
                <div className="w-8 h-8 rounded-full bg-[#f5f6f6] hover:bg-blue-50 text-[#2563eb] flex items-center justify-center shrink-0 border border-gray-200 transition-colors">
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
                <div className="absolute right-0 mt-2 w-56 bg-white text-gray-900 rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-4 py-3 border-b border-gray-100 bg-[#f5f6f6]/60">
                    <p className="text-xs font-black text-[#2563eb] line-clamp-1">{company?.nomeFantasia || user?.name}</p>
                    <p className="text-[10px] text-gray-500 font-mono mt-0.5">{company?.cnpj}</p>
                  </div>

                  <Link href="/conta" onClick={() => setIsAccountMenuOpen(false)} className="block px-4 py-2 hover:bg-[#f5f6f6] hover:text-[#2563eb] text-sm font-bold">
                    Painel da Empresa
                  </Link>

                  <Link href="/conta/pedidos" onClick={() => setIsAccountMenuOpen(false)} className="block px-4 py-2 hover:bg-[#f5f6f6] hover:text-[#2563eb] text-sm">
                    Meus Pedidos & Faturas
                  </Link>

                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button
                      onClick={() => { logout(); setIsAccountMenuOpen(false); }}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-bold flex items-center gap-1.5 cursor-pointer text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sair da Conta</span>
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
              className="flex items-center gap-2 hover:text-[#2563eb] transition-colors py-2 cursor-pointer"
              title="Abrir Carrinho"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-gray-800" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#2563eb] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
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
              <Link href="/produtos" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-gray-50">
                Catálogo de Produtos
              </Link>
              <Link href="/produtos?deals=true" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-gray-50">
                Ofertas
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Cart Slideover Component */}
      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </>
  );
}
