'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, ArrowLeft } from 'lucide-react';
import CompanyPanelHeader from '@/components/layout/CompanyPanelHeader';
import { useToast } from '@/context/ToastContext';
import { UserRole } from '@/types/b2b';

export default function NovoUsuarioPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState<UserRole>('BUYER');
  const [userLimit, setUserLimit] = useState<number>(5000);
  const [formError, setFormError] = useState('');

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userEmail) {
      setFormError('Preencha os campos obrigatórios.');
      return;
    }
    showToast('Novo usuário cadastrado e convite enviado por e-mail!', 'success');
    router.push('/conta/clientes');
  };

  return (
    <div className="pb-20 font-sans">
      <CompanyPanelHeader 
        title="Cadastrar Novo Colaborador" 
        subtitle="Adicione compradores e aprovadores para a sua conta empresarial."
        actions={
          <Link href="/conta/clientes" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 font-bold text-sm bg-white border border-gray-200 px-4 py-2 rounded-xl">
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar</span>
          </Link>
        }
      />

      <div className="max-w-3xl mx-auto px-4 lg:px-12 mt-8">
        <form onSubmit={handleSaveUser} className="bg-white rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm border border-gray-100">
          
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-[#2563eb] flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900">Perfil e Permissões</h3>
              <p className="text-xs text-gray-400">Defina o limite de faturamento individual por pedido.</p>
            </div>
          </div>

          {formError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-bold border border-red-100">
              {formError}
            </div>
          )}

          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Nome do colaborador"
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">E-mail Corporativo *</label>
                <input
                  type="email"
                  required
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="email@empresa.com.br"
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-2.5 font-medium focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Perfil de Acesso *</label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                >
                  <option value="BUYER">COMPRADOR (Apenas faz pedidos)</option>
                  <option value="APPROVER">APROVADOR (Aprova pedidos pendentes)</option>
                  <option value="ADMIN">ADMINISTRADOR (Gerencia CNPJs e limites)</option>
                </select>
                <p className="text-[10px] text-gray-400 mt-1.5 leading-snug">
                  * Compradores só podem aprovar seus próprios carrinhos caso estejam dentro do limite da sua alçada.
                </p>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Alçada: Limite Máximo por Pedido *</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400 font-bold">R$</span>
                  <input
                    type="number"
                    required
                    value={userLimit}
                    onChange={(e) => setUserLimit(Number(e.target.value))}
                    className="w-full bg-[#f5f6f6] border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 font-bold focus:outline-none focus:ring-2 focus:ring-[#2563eb]"
                  />
                </div>
                <p className="text-[10px] text-amber-600 mt-1.5 font-semibold bg-amber-50 p-1.5 rounded-lg border border-amber-100">
                  ⚠️ Pedidos acima deste valor exigirão aprovação prévia de um gestor (APPROVER) da empresa.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
            <Link
              href="/conta/clientes"
              className="px-6 py-2.5 rounded-xl font-bold text-sm text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="bg-[#2563eb] text-white font-bold text-sm px-6 py-2.5 rounded-xl hover:bg-[#1d4ed8] transition-colors shadow-xs"
            >
              Salvar & Enviar Convite
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
