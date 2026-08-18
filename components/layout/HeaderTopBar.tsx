'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Phone, ChevronDown, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useStorefront } from '@/context/StorefrontContext';

export default function HeaderTopBar() {
  const { user, isAuthenticated } = useAuth();
  const { config } = useStorefront();

  const [location, setLocation] = useState('São Paulo, SP');
  const [isLocOpen, setIsLocOpen] = useState(false);

  const locRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (locRef.current && !locRef.current.contains(e.target as Node)) {
        setIsLocOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="text-white text-xs py-2 px-4 lg:px-12 font-medium transition-colors"
      style={{ backgroundColor: config.theme.primaryColor || '#004e38' }}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        
        {/* Telefone de Contato */}
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-white/90" />
          <span className="font-semibold text-white/95 text-[11px] sm:text-xs">0800 123 4567</span>
        </div>

        {/* Mensagem Promocional / Announcement */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] sm:text-xs font-normal text-white/90">
          <span>{config.announcement.enabled ? config.announcement.text : 'Ganhe até 50% de Desconto em Fones Selecionados'}</span>
          <span className="text-white/60">|</span>
          <Link href={config.announcement.linkUrl || '/produtos'} className="font-bold underline hover:text-white transition-colors">
            {config.announcement.linkText || 'Comprar Agora'}
          </Link>
        </div>

        {/* Seletores: Perfil B2B, Idioma e Localização */}
        <div className="flex items-center gap-4 sm:gap-6 text-[11px] sm:text-xs">
          
          {/* USUÁRIO AUTENTICADO B2B */}
          {isAuthenticated && user && (
            <Link
              href="/conta"
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full text-[10px] font-bold text-white transition-colors cursor-pointer"
            >
              <UserCheck className="w-3 h-3 text-emerald-300" />
              <span className="truncate max-w-[150px]">
                {user.role === 'ADMIN' ? '👑 Admin' : user.role === 'APPROVER' ? '👔 Aprovador' : `👤 ${user.name.split(' ')[0]}`}
              </span>
            </Link>
          )}

          {/* Idioma Fixo PT-BR */}
          <div className="hidden sm:flex items-center gap-1 font-semibold text-white/95">
            <span>PT-BR</span>
          </div>

          {/* Seletor de Localização */}
          <div className="relative" ref={locRef}>
            <button
              onClick={() => setIsLocOpen(!isLocOpen)}
              className="flex items-center gap-1 hover:text-white/80 transition-colors cursor-pointer"
            >
              <span>{location}</span>
              <ChevronDown className="w-3 h-3 text-white/80" />
            </button>

            {isLocOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-gray-900 rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {['São Paulo, SP', 'Rio de Janeiro, RJ', 'Joinville, SC', 'Belo Horizonte, MG', 'Salvador, BA'].map((loc) => (
                  <button
                    key={loc}
                    onClick={() => { setLocation(loc); setIsLocOpen(false); }}
                    className="w-full text-left px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-[#004e38] transition-colors cursor-pointer"
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
