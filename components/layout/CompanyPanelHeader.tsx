'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Boxes,
  Package,
  Tag,
  FileText,
  Users,
  RotateCcw,
  FileCheck2,
  Server,
  TrendingUp,
  Paintbrush,
  Settings,
  Building2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface CompanyPanelHeaderProps {
  title?: string;
  subtitle?: string;
  activeBadge?: string;
  actions?: React.ReactNode;
}

export default function CompanyPanelHeader({
  title,
  subtitle,
  activeBadge,
  actions
}: CompanyPanelHeaderProps) {
  const pathname = usePathname();
  const { company, user, openEditCompanyModal } = useAuth();

  const currentCompany = company || {
    cnpj: '12.345.678/0001-95',
    razaoSocial: 'Tech Solutions & Tecnologia LTDA',
    nomeFantasia: 'Tech Solutions B2B',
    regimeTributario: 'LUCRO_REAL',
    creditLimitTotal: 500000.0,
    creditLimitAvailable: 357505.0,
  };

  const navItems = [
    { href: '/conta', label: 'Visão Geral', icon: LayoutDashboard, exact: true },
    { href: '/conta/pedidos', label: 'Pedidos Faturados', icon: ShoppingBag, badge: '46' },
    { href: '/conta/estoque', label: 'Estoque Multi-CD', icon: Boxes, highlight: true },
    { href: '/conta/produtos', label: 'Catálogo & Lotes', icon: Package },
    { href: '/conta/tabelas-de-precos', label: 'Tabelas de Preços', icon: Tag },
    { href: '/conta/faturas', label: 'Faturas & Boletos', icon: FileText },
    { href: '/conta/clientes', label: 'Filiais & Equipe', icon: Users },
    { href: '/conta/rma', label: 'RMA & Devoluções', icon: RotateCcw },
    { href: '/conta/contratos', label: 'Contratos B2B', icon: FileCheck2 },
    { href: '/conta/integracoes', label: 'ERPs & Webhooks', icon: Server },
    { href: '/conta/analise-tributaria', label: 'Relatórios Fiscais', icon: TrendingUp },
    { href: '/conta/personalizacao', label: 'Vitrine SaaS', icon: Paintbrush, special: true },
    { href: '/conta/configuracoes', label: 'Configurações', icon: Settings },
  ];

  const creditUsedPct = Math.min(
    100,
    Math.max(
      0,
      (((currentCompany.creditLimitTotal - currentCompany.creditLimitAvailable) /
        (currentCompany.creditLimitTotal || 1)) *
        100)
    )
  );

  return (
    <div className="bg-white border-b border-gray-200 shadow-2xs">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 pt-6 pb-2 space-y-5">
        
        {/* Top Company Identity & Credit Limit Summary Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-emerald-950 via-[#004e38] to-[#023b2b] text-white p-4 sm:p-5 rounded-3xl shadow-sm">
          
          {/* Company Brand & Info */}
          <div className="flex items-center gap-3.5">
            <button
              onClick={openEditCompanyModal}
              title="Editar dados da empresa"
              className="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-black text-base border border-white/20 transition-transform hover:scale-105 cursor-pointer shrink-0"
            >
              {currentCompany.nomeFantasia.charAt(0)}
            </button>
            <div className="space-y-0.5 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-tight text-white truncate max-w-[280px] sm:max-w-md">
                  {currentCompany.nomeFantasia}
                </span>
                <span className="bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                  CNPJ Ativo
                </span>
                {currentCompany.regimeTributario && (
                  <span className="bg-white/10 text-white text-[9px] font-mono px-2 py-0.5 rounded-full">
                    {currentCompany.regimeTributario}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-emerald-200 font-mono truncate">
                CNPJ: {currentCompany.cnpj} • Operador: <strong>{user?.name || 'Administrador'}</strong> ({user?.role || 'ADMIN'})
              </p>
            </div>
          </div>

          {/* Credit Limit Indicator & Shortcuts */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold shrink-0">
            <div className="bg-black/20 border border-white/10 px-4 py-2.5 rounded-2xl space-y-1.5 min-w-[200px]">
              <div className="flex justify-between items-center text-[10px] text-emerald-200 font-bold">
                <span>Limite Disponível</span>
                <span className="text-amber-300 font-black">
                  R$ {currentCompany.creditLimitAvailable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${100 - creditUsedPct}%` }}
                />
              </div>
              <div className="flex justify-between text-[9px] text-emerald-300/80">
                <span>Total: R$ {currentCompany.creditLimitTotal.toLocaleString('pt-BR')}</span>
                <span>{((currentCompany.creditLimitAvailable / currentCompany.creditLimitTotal) * 100).toFixed(0)}% livre</span>
              </div>
            </div>

            <Link
              href="/cotacoes"
              className="bg-amber-400 hover:bg-amber-300 text-gray-950 font-black text-xs px-4 py-2.5 rounded-xl transition-transform hover:scale-105 flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-amber-900" />
              <span>Mesa de Cotação RFQ</span>
            </Link>
          </div>

        </div>

        {/* Page Title & Actions Section (if provided) */}
        {(title || actions) && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                  {title}
                </h1>
                {activeBadge && (
                  <span className="bg-emerald-100 text-[#004e38] font-bold text-xs px-2.5 py-0.5 rounded-full">
                    {activeBadge}
                  </span>
                )}
              </div>
              {subtitle && (
                <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
              )}
            </div>

            {actions && (
              <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-auto">
                {actions}
              </div>
            )}
          </div>
        )}

        {/* Scrollable Navigation Pill Bar */}
        <nav className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs font-bold pt-1 -mx-2 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/conta');

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all shrink-0 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#004e38] text-white shadow-xs font-black'
                    : item.special
                    ? 'bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200'
                    : item.highlight
                    ? 'bg-emerald-50/70 text-[#004e38] hover:bg-emerald-100 border border-emerald-200'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : ''}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-white text-[#004e38]' : 'bg-emerald-100 text-[#004e38]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

      </div>
    </div>
  );
}
