'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  FileText,
  TrendingUp,
  Settings,
  HelpCircle,
  Plus,
  Download,
  Search,
  Calendar,
  ChevronDown,
  Bell,
  GripVertical,
  X,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Send,
  Building2,
  ArrowUp,
  ArrowDown,
  Boxes,
  Tag,
  RotateCcw,
  Server,
  FileCheck2,
  Paintbrush
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

interface WidgetItem {
  id: string;
  title: string;
  category: string;
  type: 'stat' | 'chart' | 'gauge' | 'table' | 'ai';
  description: string;
  enabled: boolean;
  colSpan?: string;
}

export default function CorporateDashboardPage() {
  const { company, openEditCompanyModal } = useAuth();
  const { showToast } = useToast();
  
  const currentCompany = company || {
    id: 'comp-1',
    cnpj: '12.345.678/0001-95',
    razaoSocial: 'Tech Solutions & Tecnologia LTDA',
    nomeFantasia: 'Tech Solutions B2B',
    logoUrl: '',
    industrySegment: 'Tecnologia Corporativa & Datacenter',
    inscricaoEstadual: '112.345.678.910',
    inscricaoMunicipal: '98765432-1',
    regimeTributario: 'LUCRO_REAL' as const,
    suframaCode: '200145892',
    hasSuframaIncentive: false,
    status: 'APPROVED' as const,
    creditLimitTotal: 500000.0,
    creditLimitAvailable: 357505.0,
    mainAddress: {
      cep: '01310-100',
      logradouro: 'Av. Paulista',
      numero: '1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      pais: 'Brasil',
    },
    branches: [],
  };

  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'ytd' | 'all'>('30d');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: 'Olá! Sou o Assistente de Inteligência Fiscal e Estoque B2B. Em que posso ajudar hoje?' }
  ]);

  // Lista de Widgets com estado de habilitação, posição e reordenação garantida
  const [widgets, setWidgets] = useState<WidgetItem[]>([
    { id: 'kpi-views', title: 'Visualizações do Catálogo', category: '#AudienceInsights', type: 'stat', description: 'Métrica de acessos das filiais e compradores ao catálogo.', enabled: true, colSpan: 'lg:col-span-3' },
    { id: 'kpi-buyers', title: 'Empresas Compradoras', category: '#Operations', type: 'stat', description: 'Total de CNPJs ativos realizando cotações.', enabled: true, colSpan: 'lg:col-span-3' },
    { id: 'kpi-clicks', title: 'Taxa de Conversão', category: '#Performance', type: 'stat', description: 'Cliques convertidos em carrinhos e faturamento.', enabled: true, colSpan: 'lg:col-span-3' },
    { id: 'kpi-orders', title: 'Pedidos Faturados', category: '#Operations', type: 'stat', description: 'Volume total de pedidos aprovados no período.', enabled: true, colSpan: 'lg:col-span-3' },
    { id: 'widget-profit-chart', title: 'Faturamento Total & Lucro B2B', category: '#Finance', type: 'chart', description: 'Gráfico comparativo de faturamento mensal por segmento.', enabled: true, colSpan: 'lg:col-span-8' },
    { id: 'widget-active-days', title: 'Dias Mais Ativos de Compra', category: '#Operations', type: 'chart', description: 'Distribuição de pedidos por dia da semana.', enabled: true, colSpan: 'lg:col-span-4' },
    { id: 'widget-reorder-gauge', title: 'Taxa de Recompra Corporativa', category: '#Strategy', type: 'gauge', description: 'Indicador de fidelidade e recompra de lotes.', enabled: true, colSpan: 'lg:col-span-4' },
    { id: 'widget-ai-assistant', title: 'Assistente Virtual de Inteligência Fiscal', category: '#AI', type: 'ai', description: 'IA para consulta imediata de impostos e estoque.', enabled: true, colSpan: 'lg:col-span-4' },
    { id: 'widget-best-sellers', title: 'Produtos Mais Vendidos em Lote', category: '#Sales', type: 'table', description: 'Tabela de SKUs com maior receita faturada.', enabled: true, colSpan: 'lg:col-span-8' },
  ]);

  // Drag and Drop State
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Manipulador de início de arraste
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  // Manipulador sobrevoo de arraste
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  // Manipulador de soltura (Drop) com troca de posição imediata
  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const newWidgets = [...widgets];
    const [movedItem] = newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(targetIndex, 0, movedItem);

    setWidgets(newWidgets);
    setDraggedIndex(null);
  };

  // Reordenação por clique de seta Up/Down (fallback 100% à prova de falhas)
  const moveWidget = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= widgets.length) return;

    const newWidgets = [...widgets];
    const [movedItem] = newWidgets.splice(index, 1);
    newWidgets.splice(targetIndex, 0, movedItem);
    setWidgets(newWidgets);
  };

  // Habilitar / Desabilitar Widget
  const toggleWidget = (id: string) => {
    setWidgets(prev =>
      prev.map(w => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const handleSendAiPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;

    const userMsg = aiPrompt;
    setAiMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setAiPrompt('');

    setTimeout(() => {
      let reply = 'Com base no histórico tributário da sua empresa, os pedidos para SP possuem alíquota de 18% de ICMS, com isenção total de IPI para itens com NCM de áudio profissional.';
      if (userMsg.toLowerCase().includes('crédito') || userMsg.toLowerCase().includes('limite')) {
        reply = `Seu limite total é de R$ ${currentCompany.creditLimitTotal.toLocaleString('pt-BR')}, com R$ ${currentCompany.creditLimitAvailable.toLocaleString('pt-BR')} disponível para faturamento imediato em 28/56/84 dias.`;
      } else if (userMsg.toLowerCase().includes('estoque') || userMsg.toLowerCase().includes('cd')) {
        reply = 'O Centro de Distribuição de São Paulo possui 240 unidades do produto AirPods Max prontas para expedição hoje.';
      }
      setAiMessages(prev => [...prev, { sender: 'ai', text: reply }]);
    }, 500);
  };

  const handleExportReport = () => {
    const content = `=====================================================
RELATÓRIO CONSOLIDADO DE PERFORMANCE CORPORATIVA B2B
Empresa: ${currentCompany.razaoSocial}
CNPJ: ${currentCompany.cnpj}
Data de Emissão: ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')}
=====================================================
INDICADORES FINANCEIROS:
- Limite de Crédito Total: R$ ${currentCompany.creditLimitTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Limite Disponível: R$ ${currentCompany.creditLimitAvailable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
- Regime Tributário: ${currentCompany.regimeTributario}
- Inscrição Estadual: ${currentCompany.inscricaoEstadual || 'ISENTO'}

WIDGETS ATIVOS NO PAINEL:
${widgets.filter(w => w.enabled).map(w => `- [${w.category}] ${w.title}: ${w.description}`).join('\n')}
=====================================================`;

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_consolidado_${currentCompany.cnpj.replace(/\D/g, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Relatório consolidado exportado com sucesso!', 'success');
  };

  return (
    <div className="flex flex-col flex-1 min-w-0 pb-16">
      {/* Top Sticky Header Controls Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 flex items-center justify-between gap-4">
          
          {/* Global Search Bar */}
          <div className="relative max-w-md w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar pedido, NF-e, SKU ou produto... ⌘K"
              className="w-full bg-[#f5f6f6] focus:bg-white border border-transparent focus:border-[#2563eb] rounded-full py-2 pl-4 pr-10 text-xs font-medium focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-gray-400 absolute right-3 top-2.5" />
          </div>

          {/* Right Header Action Buttons */}
          <div className="flex items-center gap-3 text-xs font-bold shrink-0">
            
            {/* Date Range Selector */}
            <div className="hidden sm:flex items-center gap-1 bg-[#f5f6f6] px-3 py-1.5 rounded-full border border-gray-200 text-gray-700">
              <Calendar className="w-3.5 h-3.5 text-[#2563eb]" />
              <select
                value={dateRange}
                onChange={(e) => {
                  const val = e.target.value as '7d' | '30d' | 'ytd' | 'all';
                  setDateRange(val);
                  showToast(`Filtro de período atualizado para: ${e.target.options[e.target.selectedIndex].text}`, 'info');
                }}
                className="bg-transparent font-bold text-xs text-gray-800 focus:outline-none cursor-pointer"
              >
                <option value="7d">Últimos 7 Dias</option>
                <option value="30d">Últimos 30 Dias</option>
                <option value="ytd">Ano Atual (2026)</option>
                <option value="all">Histórico Completo</option>
              </select>
            </div>

            {/* ADD WIDGET BUTTON (Opens Modal / Drawer) */}
            <button
              onClick={() => setIsAddWidgetOpen(true)}
              className="flex items-center gap-1.5 bg-[#f5f6f6] hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-full border border-gray-200 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#2563eb]" />
              <span>Adicionar Widget</span>
            </button>

            {/* EXPORT REPORT BUTTON */}
            <button
              onClick={handleExportReport}
              className="flex items-center gap-1.5 bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-5 py-2 rounded-full transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Relatório</span>
            </button>

            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block"></div>

            {/* Notification Bell */}
            <button className="p-2 rounded-full hover:bg-gray-100 text-gray-600 relative cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 bg-blue-600 rounded-full absolute top-1.5 right-1.5"></span>
            </button>

            {/* User Profile Badge */}
            <button
              onClick={openEditCompanyModal}
              className="flex items-center gap-2 hover:bg-gray-50 p-1 rounded-full border border-gray-200 transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[#2563eb] text-white font-bold flex items-center justify-center text-xs">
                {currentCompany.nomeFantasia.charAt(0)}
              </div>
            </button>

          </div>
        </header>

        {/* Dashboard Title & Drag instruction banner */}
        <div className="p-6 lg:p-8 space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Painel Corporativo B2B
              </h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Acompanhamento em tempo real de faturamento, limite de crédito e cotações da empresa <strong>{currentCompany.nomeFantasia}</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-blue-50 text-[#2563eb] px-4 py-2 rounded-2xl border border-blue-200 text-xs font-bold">
              <Building2 className="w-4 h-4 text-[#2563eb]" />
              <span>Limite de Crédito Disponível: R$ {currentCompany.creditLimitAvailable.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>

          {/* Interactive Drag & Drop Helper Tip */}
          <div className="bg-[#f5f6f6] border border-gray-200 p-3.5 rounded-2xl flex items-center justify-between text-xs text-gray-600 font-medium">
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-[#2563eb]" />
              <span>
                <strong>Customização Dinâmica Ativa:</strong> Arraste os cards pelas alças para trocar de lugar ou utilize as setas (▲/▼) de reordenação direta.
              </span>
            </div>
            <button
              onClick={() => setIsAddWidgetOpen(true)}
              className="text-[10px] bg-white text-[#2563eb] font-extrabold px-3 py-1 rounded-md border border-gray-200 hover:bg-blue-50"
            >
              Gerenciar {widgets.filter(w => w.enabled).length} de {widgets.length} Widgets
            </button>
          </div>

          {/* 3. DYNAMICALLY ORDERED WIDGETS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {widgets.map((widget, index) => {
              if (!widget.enabled) return null;

              return (
                <div
                  key={widget.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`${widget.colSpan || 'lg:col-span-6'} transition-all duration-150`}
                >
                  {/* WIDGET CONTAINER */}
                  <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-4 shadow-2xs group hover:border-[#2563eb] relative">
                    
                    {/* Widget Card Header with Drag Handle & Reorder Controls */}
                    <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                      <div className="flex items-center gap-2">
                        <div className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded-md text-gray-400 group-hover:text-gray-700">
                          <GripVertical className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-extrabold text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded uppercase">
                          {widget.category}
                        </span>
                        <h3 className="text-sm font-extrabold text-gray-900">{widget.title}</h3>
                      </div>

                      {/* Quick Move & Hide Buttons */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveWidget(index, 'up')}
                          disabled={index === 0}
                          className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-30 text-gray-500 cursor-pointer"
                          title="Mover para cima"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => moveWidget(index, 'down')}
                          disabled={index === widgets.length - 1}
                          className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-30 text-gray-500 cursor-pointer"
                          title="Mover para baixo"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleWidget(widget.id)}
                          className="p-1 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-600 cursor-pointer ml-1"
                          title="Ocultar Widget"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* WIDGET CONTENT RENDERERS */}
                    {widget.type === 'stat' && (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-baseline justify-between">
                          <span className="text-3xl font-black text-gray-900">
                            {widget.id === 'kpi-views' && '16.431'}
                            {widget.id === 'kpi-buyers' && '6.225'}
                            {widget.id === 'kpi-clicks' && '2.832'}
                            {widget.id === 'kpi-orders' && '1.224'}
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                            widget.id === 'kpi-clicks' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-700'
                          }`}>
                            {widget.id === 'kpi-clicks' ? <ArrowDownRight className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                            {widget.id === 'kpi-views' && '+15,5%'}
                            {widget.id === 'kpi-buyers' && '+8,4%'}
                            {widget.id === 'kpi-clicks' && '-10,5%'}
                            {widget.id === 'kpi-orders' && '+4,4%'}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 font-medium">Comparado ao período anterior</p>
                      </div>
                    )}

                    {widget.id === 'widget-profit-chart' && (
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1">
                            <div className="text-3xl font-black text-gray-900">R$ 446.700,00</div>
                            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1">
                              <ArrowUpRight className="w-3.5 h-3.5" /> +24,4% vs. período anterior
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[11px] font-bold">
                            <span className="bg-[#2563eb] text-white px-3 py-1 rounded-full cursor-pointer">Varejistas (2.884)</span>
                            <span className="bg-[#f5f6f6] text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-full cursor-pointer">Distribuidores (1.432)</span>
                            <span className="bg-[#f5f6f6] text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-full cursor-pointer">Atacadistas (562)</span>
                          </div>
                        </div>

                        <div className="relative h-48 w-full bg-[#f8fafc] rounded-2xl p-4 flex flex-col justify-between border border-gray-100 overflow-hidden">
                          <svg className="absolute inset-0 w-full h-full p-4 overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 150">
                            <defs>
                              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                                <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                              </linearGradient>
                            </defs>
                            <line x1="0" y1="30" x2="500" y2="30" stroke="#e2e8f0" strokeDasharray="4 4" />
                            <line x1="0" y1="75" x2="500" y2="75" stroke="#e2e8f0" strokeDasharray="4 4" />
                            <line x1="0" y1="120" x2="500" y2="120" stroke="#e2e8f0" strokeDasharray="4 4" />
                            <path d="M 0 100 Q 80 40, 160 90 T 320 30 T 500 60 L 500 150 L 0 150 Z" fill="url(#chartGrad)" />
                            <path d="M 0 100 Q 80 40, 160 90 T 320 30 T 500 60" fill="none" stroke="#2563eb" strokeWidth="3" />
                            <circle cx="320" cy="30" r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                          </svg>

                          <div className="absolute top-4 left-[58%] bg-white shadow-xl border border-gray-200 p-2 rounded-xl text-[10px] space-y-0.5 z-10 animate-bounce">
                            <p className="font-bold text-gray-400">18 Jan, 2026</p>
                            <p className="font-black text-[#2563eb]">R$ 112.324 este mês</p>
                          </div>

                          <div className="flex justify-between text-[10px] font-bold text-gray-400 pt-32 z-10">
                            <span>1 Jan</span>
                            <span>8 Jan</span>
                            <span>15 Jan</span>
                            <span>22 Jan</span>
                            <span>29 Jan</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {widget.id === 'widget-best-sellers' && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                            <tr>
                              <th className="pb-2">SKU ID</th>
                              <th className="pb-2">Produto</th>
                              <th className="pb-2 text-right">Lotes Vendidos</th>
                              <th className="pb-2 text-right">Receita Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 font-medium">
                            {[
                              { sku: 'NTB-DELL-LAT7420', name: 'Notebook Dell Latitude 7420', sold: 450, revenue: 3375000, img: '/imagem.jpeg' },
                              { sku: 'SRV-HP-DL380', name: 'Servidor HP ProLiant', sold: 32, revenue: 800000, img: '/imagem.jpeg' },
                              { sku: 'MON-DELL-P2422H', name: 'Monitor Dell 24"', sold: 820, revenue: 984000, img: '/imagem.jpeg' }
                            ].map((row: { sku: string; name: string; sold: number; revenue: number; img: string }, idx) => (
                              <tr key={idx} className="hover:bg-[#f5f6f6]/60 transition-colors">
                                <td className="py-2.5 font-mono text-gray-400 font-bold">{row.sku}</td>
                                <td className="py-2.5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#f5f6f6] p-1 flex items-center justify-center shrink-0">
                                      <Image src={row.img} alt="" width={24} height={24} className="object-contain" />
                                    </div>
                                    <span className="font-bold text-gray-900 line-clamp-1">{row.name}</span>
                                  </div>
                                </td>
                                <td className="py-2.5 text-right text-gray-600 font-semibold">{row.sold}</td>
                                <td className="py-2.5 text-right font-black text-[#2563eb]">
                                  R$ {row.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {widget.id === 'widget-active-days' && (
                      <div className="flex items-end justify-between h-36 pt-4 px-2">
                        {[
                          { day: 'Seg', val: 40, active: false },
                          { day: 'Ter', val: 70, active: false },
                          { day: 'Qua', val: 100, active: true },
                          { day: 'Qui', val: 60, active: false },
                          { day: 'Sex', val: 30, active: false }
                        ].map((bar: { day: string; val: number; active: boolean }, i) => (
                          <div key={i} className="flex flex-col items-center gap-2 flex-1">
                            {bar.active && (
                              <span className="text-[9px] font-black text-[#2563eb] bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                                8.162
                              </span>
                            )}
                            <div style={{ height: `${bar.val}%` }} className={`w-4 rounded-t-lg transition-all ${bar.active ? 'bg-[#2563eb]' : 'bg-gray-200'}`} />
                            <span className={`text-[10px] font-bold ${bar.active ? 'text-[#2563eb]' : 'text-gray-400'}`}>{bar.day}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {widget.id === 'widget-reorder-gauge' && (
                      <div className="text-center space-y-2">
                        <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="40" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                            <circle cx="50" cy="50" r="40" stroke="#16a34a" strokeWidth="8" fill="none" strokeDasharray="251.2" strokeDashoffset="80" strokeLinecap="round" />
                          </svg>
                          <div className="absolute flex flex-col items-center">
                            <span className="text-2xl font-black text-gray-900">68%</span>
                            <span className="text-[9px] text-gray-400 font-bold">Meta 80%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {widget.id === 'widget-ai-assistant' && (
                      <div className="space-y-3">
                        <div className="h-32 overflow-y-auto space-y-2 bg-[#f8fafc] p-3 rounded-2xl border border-gray-100 text-xs">
                          {aiMessages.map((msg, i) => (
                            <div key={i} className={`p-2 rounded-xl text-[11px] ${msg.sender === 'user' ? 'bg-[#2563eb] text-white ml-auto' : 'bg-white text-gray-800 border border-gray-200'}`}>
                              {msg.text}
                            </div>
                          ))}
                        </div>
                        <form onSubmit={handleSendAiPrompt} className="relative">
                          <input
                            type="text"
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            placeholder="Pergunte sobre impostos ou estoque..."
                            className="w-full bg-[#f5f6f6] border border-gray-200 rounded-full py-2 pl-3 pr-9 text-xs font-medium focus:outline-none"
                          />
                          <button type="submit" className="w-6 h-6 rounded-full bg-[#2563eb] text-white flex items-center justify-center absolute right-1.5 top-1.5">
                            <Send className="w-3 h-3" />
                          </button>
                        </form>
                      </div>
                    )}

                  </div>
                </div>
              );
            })}
          </div>

        </div>

      

      {/* 4. MODAL DE CUSTOMIZAÇÃO & GERENCIAMENTO DE WIDGETS */}
      {isAddWidgetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
          <div className="bg-white text-gray-900 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-xl overflow-hidden relative max-h-[85vh] flex flex-col">
            
            <div className="bg-[#2563eb] text-white p-6 relative shrink-0">
              <button onClick={() => setIsAddWidgetOpen(false)} className="absolute top-5 right-5 p-1 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2.5 mb-1">
                <LayoutDashboard className="w-5 h-5 text-amber-400" />
                <h3 className="text-xl font-extrabold tracking-tight">Adicionar & Gerenciar Widgets</h3>
              </div>
              <p className="text-xs text-blue-100">
                Ative ou desative quais blocos de dados exibir no seu dashboard corporativo.
              </p>
            </div>

            <div className="p-6 overflow-y-auto space-y-3 divide-y divide-gray-100 flex-1 text-xs">
              {widgets.map((widget) => (
                <div key={widget.id} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[#2563eb] bg-blue-50 px-2 py-0.5 rounded uppercase">
                        {widget.category}
                      </span>
                      <h4 className="font-bold text-gray-900 text-xs">{widget.title}</h4>
                    </div>
                    <p className="text-gray-500 text-[11px]">{widget.description}</p>
                  </div>

                  <button
                    onClick={() => toggleWidget(widget.id)}
                    className={`px-4 py-2 rounded-full font-bold text-xs transition-all shrink-0 cursor-pointer ${
                      widget.enabled
                        ? 'bg-[#2563eb] text-white'
                        : 'bg-[#f5f6f6] text-gray-600 hover:bg-gray-200 border border-gray-200'
                    }`}
                  >
                    {widget.enabled ? 'Exibindo' : '+ Adicionar'}
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 bg-[#f5f6f6] border-t border-gray-100 flex justify-end shrink-0">
              <button
                onClick={() => setIsAddWidgetOpen(false)}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-bold text-xs px-6 py-2.5 rounded-full transition-all shadow-xs"
              >
                Salvar Configuração do Dashboard
              </button>
            </div>

          </div>
        </div>
      )}



    </div>
  );
}
