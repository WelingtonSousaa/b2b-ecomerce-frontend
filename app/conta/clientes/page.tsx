'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  MapPin,
  Plus,
  X,
  CheckCircle2,
  Trash2,
  Search,
  Loader2,
  Users,
  Shield,
  UserCheck,
  UserX,
  Mail,
  Edit2,
  FileText,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { authService } from '@/services/auth.service';
import { fetchCNPJData } from '@/lib/api/cnpj';
import { useToast } from '@/context/ToastContext';
import CompanyPanelHeader from '@/components/layout/CompanyPanelHeader';
import { CompanyUser, UserRole, CompanyAccount } from '@/types/b2b';

interface BranchItem {
  id: string;
  cnpj: string;
  nomeFilial: string;
  inscricaoEstadual?: string;
  isActive: boolean;
  address: {
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
    pais: string;
  };
}

export default function ClientesEFiliaisPage() {
  const { company, user, openEditCompanyModal, login } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'branches' | 'team' | 'fiscal'>('branches');
  const [search, setSearch] = useState('');

  // 1. Branches State
  const [branches, setBranches] = useState<BranchItem[]>([
    {
      id: 'branch-1',
      cnpj: '12.345.678/0002-76',
      nomeFilial: 'Filial Campinas / CD Logístico',
      inscricaoEstadual: '244.567.890.111',
      isActive: true,
      address: {
        logradouro: 'Rodovia Anhanguera',
        numero: 'KM 104',
        bairro: 'Polo de Alta Tecnologia',
        cidade: 'Campinas',
        uf: 'SP',
        cep: '13069-001',
        pais: 'Brasil',
      }
    },
    {
      id: 'branch-2',
      cnpj: '12.345.678/0003-57',
      nomeFilial: 'Filial Rio de Janeiro / Escritório Comercial',
      inscricaoEstadual: '87.654.321',
      isActive: true,
      address: {
        logradouro: 'Av. Rio Branco',
        numero: '156 - Sala 2104',
        bairro: 'Centro',
        cidade: 'Rio de Janeiro',
        uf: 'RJ',
        cep: '20040-003',
        pais: 'Brasil',
      }
    },
    {
      id: 'branch-3',
      cnpj: '12.345.678/0004-38',
      nomeFilial: 'Filial Joinville / Polo Industrial Sul',
      inscricaoEstadual: '256.789.012',
      isActive: true,
      address: {
        logradouro: 'Rua Dona Francisca',
        numero: '8300 - Bloco B',
        bairro: 'Distrito Industrial',
        cidade: 'Joinville',
        uf: 'SC',
        cep: '89219-600',
        pais: 'Brasil',
      }
    }
  ]);

  // 2. Team & Users State
  const [teamUsers, setTeamUsers] = useState<CompanyUser[]>([
    {
      id: 'user-admin',
      companyId: 'comp-1',
      name: 'Carlos Eduardo Santos',
      email: 'carlos.compras@techsolutions.com.br',
      role: 'ADMIN',
      spendingLimitPerOrder: 500000,
      isActive: true,
    },
    {
      id: 'user-approver',
      companyId: 'comp-1',
      name: 'Helena Castro (Diretora Financeira)',
      email: 'helena.castro@techsolutions.com.br',
      role: 'APPROVER',
      spendingLimitPerOrder: 500000,
      isActive: true,
    },
    {
      id: 'user-senior',
      companyId: 'comp-1',
      name: 'Marina Silva (Compradora Sênior)',
      email: 'marina.silva@techsolutions.com.br',
      role: 'BUYER',
      spendingLimitPerOrder: 25000,
      isActive: true,
    },
    {
      id: 'user-junior',
      companyId: 'comp-1',
      name: 'Lucas Ferreira (Comprador Júnior)',
      email: 'lucas.ferreira@techsolutions.com.br',
      role: 'BUYER',
      spendingLimitPerOrder: 5000,
      isActive: true,
    }
  ]);

  // Load live data on mount
  React.useEffect(() => {
    const compId = company?.id || 'comp-1';
    authService.getCompanyBranches(compId).then((res) => {
      if (res.data && res.data.length > 0) {
        setBranches(res.data.map(b => ({
          id: b.id,
          cnpj: b.cnpj,
          nomeFilial: b.nomeFilial,
          inscricaoEstadual: b.inscricaoEstadual,
          isActive: true,
          address: {
            logradouro: b.address?.logradouro || '',
            numero: b.address?.numero || '',
            bairro: b.address?.bairro || '',
            cidade: b.address?.cidade || '',
            uf: b.address?.uf || 'SP',
            cep: b.address?.cep || '',
            pais: b.address?.pais || 'Brasil',
          }
        })));
      }
    }).catch(() => {});

    authService.getCompanyUsers(compId).then((res) => {
      if (res.data && res.data.length > 0) {
        setTeamUsers(res.data);
      }
    }).catch(() => {});
  }, [company?.id]);

  const currentCompany: CompanyAccount = company || {
    id: 'comp-1',
    cnpj: '12.345.678/0001-95',
    razaoSocial: 'Tech Solutions & Tecnologia LTDA',
    nomeFantasia: 'Tech Solutions B2B',
    industrySegment: 'Tecnologia Corporativa',
    inscricaoEstadual: '112.345.678.910',
    inscricaoMunicipal: '98765432-1',
    regimeTributario: 'LUCRO_REAL',
    suframaCode: '200145892',
    hasSuframaIncentive: false,
    status: 'APPROVED',
    creditLimitTotal: 500000.0,
    creditLimitAvailable: 357505.0,
    mainAddress: {
      logradouro: 'Av. Paulista',
      numero: '1000',
      bairro: 'Bela Vista',
      cidade: 'São Paulo',
      uf: 'SP',
      cep: '01310-100',
      pais: 'Brasil'
    },
    branches: []
  };

  const handleToggleBranchActive = (id: string) => {
    setBranches(prev => prev.map(b => b.id === id ? { ...b, isActive: !b.isActive } : b));
    showToast('Status da filial atualizado.', 'info');
  };
  const handleDeleteBranch = (id: string, name: string) => {
    if (confirm(`Deseja realmente desvincular a filial "${name}"?`)) {
      setBranches(prev => prev.filter(b => b.id !== id));
      showToast(`Filial "${name}" removida com sucesso.`, 'info');
      authService.deleteCompanyBranch(currentCompany.id || 'comp-1', id).catch(() => {});
    }
  };


  const handleToggleUserActive = (id: string) => {
    setTeamUsers(prev => prev.map(u => u.id === id ? { ...u, isActive: !u.isActive } : u));
    showToast('Status de acesso do usuário atualizado.', 'info');
    authService.toggleCompanyUserStatus(currentCompany.id || 'comp-1', id).catch(() => {});
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Deseja revogar o acesso do usuário "${name}"?`)) {
      setTeamUsers(prev => prev.filter(u => u.id !== id));
      showToast(`Acesso de "${name}" revogado.`, 'info');
      authService.deleteCompanyUser(currentCompany.id || 'comp-1', id).catch(() => {});
    }
  };


  // Role Simulator switch
  const handleSimulateRole = async (targetUser: CompanyUser) => {
    await login(targetUser.email);
    showToast(`Sessão alternada para: ${targetUser.name} (${targetUser.role})`, 'success');
  };

  const filteredBranches = branches.filter(b =>
    b.nomeFilial.toLowerCase().includes(search.toLowerCase()) ||
    b.cnpj.includes(search) ||
    b.address.cidade.toLowerCase().includes(search.toLowerCase()) ||
    b.address.uf.toLowerCase().includes(search.toLowerCase())
  );

  const filteredUsers = teamUsers.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen pb-20 font-sans">
      
      {/* 1. SHARED COMPANY PANEL HEADER */}
      <CompanyPanelHeader
        title="Gestão de Filiais, CNPJs & Alçadas da Equipe"
        subtitle="Gerencie os CNPJs de faturamento, locais de entrega e permissões hierárquicas de compra dos colaboradores."
        activeBadge={`${branches.length} Filiais • ${teamUsers.length} Usuários`}
        actions={
          activeTab === 'branches' ? (
            <Link
              href="/conta/clientes/nova-filial"
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-black px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Adicionar Nova Filial (CNPJ)</span>
            </Link>
          ) : activeTab === 'team' ? (
            <Link
              href="/conta/clientes/novo-usuario"
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-black px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-amber-300" />
              <span>Convidar Colaborador</span>
            </Link>
          ) : (
            <button
              onClick={openEditCompanyModal}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-black px-5 py-2.5 rounded-full transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Edit2 className="w-4 h-4 text-amber-300" />
              <span>Editar Matriz Fiscal</span>
            </button>
          )
        }
      />

      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 pt-8 space-y-6">
        
        {/* 2. SUB-TABS SELECTOR */}
        <div className="bg-white p-1.5 rounded-2xl border border-gray-200 shadow-2xs flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('branches')}
            className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'branches'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>1. Filiais & Locais de Entrega ({branches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('team')}
            className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'team'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>2. Equipe & Alçadas de Compra ({teamUsers.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('fiscal')}
            className={`flex-1 min-w-[200px] py-2.5 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'fiscal'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>3. Matriz Fiscal & Regime Tributário</span>
          </button>
        </div>

        {/* TAB 1: FILIAIS & LOCAIS DE ENTREGA */}
        {activeTab === 'branches' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            {/* Matriz Principal Card */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4 gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center font-bold shadow-xs">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-[#2563eb] text-[10px] font-black px-2 py-0.5 rounded-full uppercase border border-blue-200">
                        Matriz Principal (Sede Corporativa)
                      </span>
                      <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {currentCompany.regimeTributario}
                      </span>
                    </div>
                    <h2 className="text-xl font-black text-gray-900 mt-1">{currentCompany.razaoSocial}</h2>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-black text-gray-800 bg-[#f5f6f6] px-3.5 py-1.5 rounded-full border border-gray-200">
                    CNPJ: {currentCompany.cnpj}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <span className="text-gray-400 font-bold text-[10px] uppercase block">Inscrição Estadual</span>
                  <p className="font-mono font-black text-gray-900 text-sm mt-0.5">{currentCompany.inscricaoEstadual}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <span className="text-gray-400 font-bold text-[10px] uppercase block">Limite de Faturamento</span>
                  <p className="font-black text-[#2563eb] text-sm mt-0.5">
                    R$ {currentCompany.creditLimitTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
                  <span className="text-gray-400 font-bold text-[10px] uppercase block">Endereço da Sede</span>
                  <p className="font-semibold text-gray-800 line-clamp-1 mt-0.5">
                    {currentCompany.mainAddress.logradouro}, {currentCompany.mainAddress.numero} - {currentCompany.mainAddress.cidade}/{currentCompany.mainAddress.uf}
                  </p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-2xs flex items-center justify-between gap-4 text-xs">
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Pesquisar filial por nome, CNPJ, cidade ou UF..."
                  className="w-full bg-[#f5f6f6] rounded-full py-2.5 pl-4 pr-10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
                <Search className="w-4 h-4 text-gray-400 absolute right-3.5 top-3" />
              </div>
              <span className="text-xs text-gray-500 font-bold hidden sm:inline">
                {filteredBranches.length} filiais habilitadas
              </span>
            </div>

            {/* Filiais Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBranches.map(branch => (
                <div key={branch.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs space-y-4 hover:border-[#2563eb] transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                      <div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                          branch.isActive ? 'text-blue-800 bg-blue-50 border border-blue-200' : 'text-gray-500 bg-gray-100'
                        }`}>
                          {branch.isActive ? 'Habilitada para NF-e' : 'Bloqueada'}
                        </span>
                        <h4 className="font-black text-sm text-gray-900 mt-1.5 line-clamp-1">{branch.nomeFilial}</h4>
                        <p className="font-mono text-xs font-bold text-gray-600">CNPJ: {branch.cnpj}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleToggleBranchActive(branch.id)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            branch.isActive ? 'text-blue-600 hover:bg-blue-50' : 'text-gray-400 hover:bg-gray-100'
                          }`}
                          title={branch.isActive ? 'Desativar filial' : 'Ativar filial'}
                        >
                          {branch.isActive ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBranch(branch.id, branch.nomeFilial)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remover filial"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-[#f8fafc] p-2.5 rounded-xl">
                        <span className="text-gray-400 text-[10px] uppercase font-bold block">Inscrição Estadual</span>
                        <p className="font-mono font-bold text-gray-800 text-[11px]">{branch.inscricaoEstadual || 'ISENTO'}</p>
                      </div>
                      <div className="bg-[#f8fafc] p-2.5 rounded-xl">
                        <span className="text-gray-400 text-[10px] uppercase font-bold block">UF de Entrega</span>
                        <p className="font-bold text-[#2563eb] text-[11px]">{branch.address.cidade} - {branch.address.uf}</p>
                      </div>
                    </div>

                    <div className="pt-2 text-xs text-gray-600 flex items-start gap-2 border-t border-gray-100">
                      <MapPin className="w-4 h-4 text-[#2563eb] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">
                        {branch.address.logradouro}, {branch.address.numero} - {branch.address.bairro} (CEP: {branch.address.cep})
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Entrega Multi-CD:</span>
                    <span className="text-[#2563eb] font-bold">CD {branch.address.uf === 'SP' ? 'Sudeste (SP)' : branch.address.uf === 'SC' ? 'Sul (SC)' : 'Nordeste (BA)'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: EQUIPE & ALÇADAS HIERÁRQUICAS */}
        {activeTab === 'team' && (
          <div className="space-y-6 animate-in fade-in duration-150">
            
            {/* Info Banner Alçadas B2B */}
            <div className="bg-blue-50 border border-blue-200 p-5 rounded-3xl text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-gray-900">Controle Hierárquico de Alçadas de Compra (B2B Approval Matrix)</h4>
                  <p className="text-gray-600 mt-0.5">
                    Pedidos que ultrapassam o limite individual do comprador ficam com status <strong>PENDING_APPROVAL</strong> e exigem liberação da Diretoria.
                  </p>
                </div>
              </div>

              <Link
                href="/pedidos-aprovacao"
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-black text-xs px-5 py-2.5 rounded-full transition-all flex items-center gap-1.5 shrink-0 shadow-xs"
              >
                <span>Central de Aprovações</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xs">
              <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-black text-base text-gray-900">Usuários Vinculados à Empresa ({teamUsers.length})</h3>
                  <p className="text-xs text-gray-400">Configure quem pode emitir pedidos, limites por transação e simule a experiência de cada perfil.</p>
                </div>

                <div className="relative max-w-xs w-full">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Filtrar colaboradores..."
                    className="w-full bg-[#f5f6f6] rounded-full py-2 pl-3 pr-8 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[#2563eb]"
                  />
                  <Search className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-2.5" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#2563eb] text-white font-extrabold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-4">Colaborador / E-mail</th>
                      <th className="p-4">Papel no Sistema</th>
                      <th className="p-4 text-right">Alçada por Pedido</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Simular Perfil</th>
                      <th className="p-4 text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    {filteredUsers.map((u) => {
                      const isCurrentUser = user?.email === u.email;

                      return (
                        <tr key={u.id} className="hover:bg-[#f8fafc] transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563eb] font-black flex items-center justify-center text-xs shrink-0 border border-blue-200">
                                {u.name.charAt(0)}
                              </div>
                              <div>
                                <span className="font-extrabold text-gray-900 block text-xs flex items-center gap-1.5">
                                  {u.name}
                                  {isCurrentUser && (
                                    <span className="bg-[#2563eb] text-white text-[9px] font-mono px-1.5 py-0.2 rounded-full">
                                      Você
                                    </span>
                                  )}
                                </span>
                                <span className="text-[11px] text-gray-400 flex items-center gap-1">
                                  <Mail className="w-3 h-3" /> {u.email}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="p-4">
                            {u.role === 'ADMIN' && (
                              <span className="bg-purple-100 text-purple-900 border border-purple-200 font-black text-[10px] px-2.5 py-1 rounded-full">
                                Administrador Master
                              </span>
                            )}
                            {u.role === 'APPROVER' && (
                              <span className="bg-blue-100 text-blue-900 border border-blue-200 font-black text-[10px] px-2.5 py-1 rounded-full">
                                Aprovadora Financeira
                              </span>
                            )}
                            {u.role === 'BUYER' && (
                              <span className="bg-blue-100 text-blue-900 border border-blue-200 font-black text-[10px] px-2.5 py-1 rounded-full">
                                Comprador B2B
                              </span>
                            )}
                          </td>

                          <td className="p-4 text-right font-mono font-black text-sm text-[#2563eb]">
                            R$ {(u.spendingLimitPerOrder || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>

                          <td className="p-4 text-center">
                            <span className={`font-bold text-[10px] px-2 py-0.5 rounded-full ${
                              u.isActive ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {u.isActive ? 'Ativo' : 'Bloqueado'}
                            </span>
                          </td>

                          <td className="p-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleSimulateRole(u)}
                              className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${
                                isCurrentUser
                                  ? 'bg-gray-100 text-gray-500 border-gray-200 cursor-default'
                                  : 'bg-white hover:bg-blue-50 text-[#2563eb] border-blue-300 shadow-2xs hover:scale-105'
                              }`}
                              disabled={isCurrentUser}
                            >
                              {isCurrentUser ? 'Perfil Ativo' : 'Simular Papel'}
                            </button>
                          </td>

                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleToggleUserActive(u.id)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer"
                                title="Alterar status de acesso"
                              >
                                <UserCheck className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u.id, u.name)}
                                className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Revogar acesso"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: MATRIZ FISCAL & REGIME TRIBUTÁRIO */}
        {activeTab === 'fiscal' && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-2xs space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-gray-900">Informações Cadastrais & Tributárias Oficiais</h3>
                <p className="text-xs text-gray-500">Dados utilizados pelo motor de cálculo fiscal (ICMS-ST, DIFAL, IPI e SUFRAMA).</p>
              </div>
              <button
                onClick={openEditCompanyModal}
                className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white text-xs font-bold px-5 py-2 rounded-full transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Editar Dados</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 space-y-1">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Razão Social</span>
                <p className="font-extrabold text-gray-900 text-sm">{currentCompany.razaoSocial}</p>
              </div>

              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 space-y-1">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Nome Fantasia</span>
                <p className="font-extrabold text-gray-900 text-sm">{currentCompany.nomeFantasia}</p>
              </div>

              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 space-y-1">
                <span className="text-gray-400 font-bold uppercase text-[10px]">CNPJ Raiz</span>
                <p className="font-mono font-extrabold text-[#2563eb] text-sm">{currentCompany.cnpj}</p>
              </div>

              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 space-y-1">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Inscrição Estadual (IE)</span>
                <p className="font-mono font-extrabold text-gray-900 text-sm">{currentCompany.inscricaoEstadual}</p>
              </div>

              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 space-y-1">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Inscrição Municipal</span>
                <p className="font-mono font-bold text-gray-900 text-sm">{currentCompany.inscricaoMunicipal || 'ISENTO'}</p>
              </div>

              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 space-y-1">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Regime Tributário</span>
                <p className="font-black text-blue-800 text-sm">{currentCompany.regimeTributario}</p>
              </div>

              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 space-y-1">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Incentivo SUFRAMA / ZFM</span>
                <p className="font-bold text-gray-900 text-sm">
                  {currentCompany.hasSuframaIncentive ? `Habilitado (Cód: ${currentCompany.suframaCode})` : 'Não Optante'}
                </p>
              </div>

              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 space-y-1">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Status de Homologação</span>
                <p className="font-black text-blue-700 text-sm">Aprovado para Faturamento a Prazo</p>
              </div>

              <div className="bg-[#f8fafc] p-4 rounded-2xl border border-gray-200 space-y-1">
                <span className="text-gray-400 font-bold uppercase text-[10px]">Segmento de Atuação</span>
                <p className="font-bold text-gray-900 text-sm">{currentCompany.industrySegment || 'Tecnologia Corporativa'}</p>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-950 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-[#2563eb] shrink-0" />
              <span>
                Para alterar o regime tributário ou solicitar isenção fiscal interestadual, consulte a página de{' '}
                <Link href="/conta/analise-tributaria" className="font-black text-[#2563eb] underline">
                  Análise e Relatórios Tributários
                </Link>.
              </span>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
