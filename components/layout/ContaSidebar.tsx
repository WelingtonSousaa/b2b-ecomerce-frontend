'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  RotateCcw,
  FileCheck2,
  Server,
  Package,
  Boxes,
  Users,
  FileText,
  TrendingUp,
  Settings,
  HelpCircle,
  Sparkles
} from 'lucide-react';

export default function ContaSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/conta' && pathname === '/conta') return true;
    if (path !== '/conta' && pathname?.startsWith(path)) return true;
    return false;
  };

  const menuItems = [
    { href: '/conta', icon: LayoutDashboard, label: 'Dashboard / Visão Geral' },
    { href: '/conta/pedidos', icon: ShoppingBag, label: 'Pedidos Faturados' },
    { href: '/conta/tabelas-de-precos', icon: Tag, label: 'Tabelas de Preços' },
    { href: '/conta/rma', icon: RotateCcw, label: 'RMA & Devoluções' },
    { href: '/conta/contratos', icon: FileCheck2, label: 'Contratos' },
    { href: '/conta/integracoes', icon: Server, label: 'Monitor ERPs' },
    { href: '/conta/produtos', icon: Package, label: 'Catálogo & Lotes' },
    { href: '/conta/estoque', icon: Boxes, label: 'Gestão de Estoque' },
    { href: '/conta/clientes', icon: Users, label: 'Clientes & CNPJs' },
  ];

  const financeItems = [
    { href: '/conta/faturas', icon: FileText, label: 'Faturas & Boletos' },
    { href: '/conta/analise-tributaria', icon: TrendingUp, label: 'Relatórios Tributários' },
  ];

  const systemItems = [
    { href: '/conta/configuracoes', icon: Settings, label: 'Configurações' },
    { href: '/faq', icon: HelpCircle, label: 'Ajuda & Suporte' },
  ];

  const renderLink = (item: any) => {
    const active = isActive(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
          active 
            ? 'bg-blue-50 text-[#2563eb] font-extrabold shadow-2xs border border-blue-100' 
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 font-semibold'
        }`}
      >
        <item.icon className="w-4 h-4" />
        <span className="text-sm">{item.label}</span>
      </Link>
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 shrink-0 hidden lg:flex flex-col justify-between p-4 sticky top-0 h-[calc(100vh-80px)] overflow-y-auto">
      <div className="space-y-6">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 py-1 mb-4">
          <div className="w-8 h-8 rounded-xl bg-[#2563eb] text-white flex items-center justify-center font-black shadow-xs">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-black text-gray-900 tracking-tight block">OneSync B2B</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Painel da Empresa</span>
          </div>
        </div>

        <nav className="space-y-1">
          {menuItems.map(renderLink)}

          <div className="pt-4 pb-1">
            <span className="px-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Finanças & Crédito</span>
          </div>
          {financeItems.map(renderLink)}

          <div className="pt-4 pb-1">
            <span className="px-3 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Sistema</span>
          </div>
          {systemItems.map(renderLink)}
        </nav>
      </div>

      {/* Promo Upgrade Box */}
      <div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] text-white p-4 rounded-2xl space-y-3 shadow-md mt-8">
        <div className="flex items-center gap-2 text-blue-200 text-xs font-extrabold">
          <Sparkles className="w-4 h-4" />
          <span>Mesa de Crédito B2B</span>
        </div>
        <p className="text-[11px] text-blue-100 leading-relaxed font-medium">
          Aumente seu limite e solicite parcelamento direto de boletos.
        </p>
        <button onClick={() => alert('Simulação: Solicitação de limite de crédito corporativo enviada para análise da mesa de crédito.')} className="block w-full bg-white text-[#2563eb] text-center text-[10px] font-black py-2 rounded-lg hover:bg-gray-50 transition-colors uppercase tracking-wider shadow-sm cursor-pointer">
          Solicitar Limite
        </button>
      </div>
    </aside>
  );
}
