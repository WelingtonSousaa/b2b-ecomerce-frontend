"use client";

import React from "react";
import {
  ShoppingCart,
  Building2,
  Search,
  Headphones,
  Bell,
  Menu,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export function Header() {
  const { isAuthenticated, company, login, logout } = useAuth();
  const isLoggedIn = isAuthenticated;
  const empresa = company?.nomeFantasia || company?.razaoSocial || "Empresa Fantasma";

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 md:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Bloco Esquerdo (Identificação) */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80">
            <ShoppingCart className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold font-serif text-slate-900 tracking-tight">
              OneSync
            </span>
          </div>

          {/* Badge da Empresa (Apenas se logado) */}
          {isLoggedIn && (
            <div className="hidden lg:flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-full py-1.5 px-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700">
                  {empresa}
                </span>
              </div>
              <span className="bg-blue-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                CNPJ OK
              </span>
            </div>
          )}
        </div>

        {/* Bloco Central (Busca) */}
        <div className="flex-1 max-w-2xl hidden md:block px-4">
          <div className="relative group w-full">
            <input
              type="text"
              placeholder="Pesquisar produto..."
              disabled={!isLoggedIn}
              className={`w-full text-sm rounded-full py-2.5 pl-5 pr-12 transition-all border ${
                isLoggedIn
                  ? "bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white border-transparent focus:border-blue-500 placeholder-gray-500"
                  : "bg-gray-50 text-gray-400 cursor-not-allowed border-gray-200"
              }`}
              aria-label="Pesquisar produto"
            />
            <button
              type="button"
              disabled={!isLoggedIn}
              className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-2 rounded-full flex items-center justify-center transition-colors ${
                isLoggedIn
                  ? "text-gray-400 hover:text-blue-600"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              aria-label="Buscar"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bloco Direito (Ações e Contato) */}
        <div className="flex items-center gap-4 lg:gap-6">
          {!isLoggedIn ? (
            <button 
              onClick={() => login()}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full transition-colors shadow-sm hidden sm:block whitespace-nowrap"
            >
              Cadastre-se para ver os preços
            </button>
          ) : (
            <>
              {/* Menu do Usuário Logado */}
              <button 
                onClick={() => logout()}
                className="hidden sm:flex items-center gap-2 hover:bg-gray-50 p-1.5 rounded-full transition-colors"
                aria-label="Sair"
                title="Clique para deslogar"
              >
                <div className="bg-blue-100 p-1.5 rounded-full text-blue-600 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium text-gray-700 max-w-[130px] truncate">
                  {empresa}
                </span>
              </button>

              {/* Carrinho */}
              <button 
                className="flex items-center gap-2 group p-1.5 rounded-full hover:bg-gray-50 transition-colors" 
                aria-label="Carrinho de Compras"
              >
                <div className="relative text-gray-600 group-hover:text-blue-600 transition-colors">
                  <ShoppingCart className="w-6 h-6" />
                  <span className="absolute -top-1.5 -right-2 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    0
                  </span>
                </div>
              </button>
            </>
          )}

          {/* Menu Mobile */}
          <button 
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-full transition-colors" 
            aria-label="Menu Principal"
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
