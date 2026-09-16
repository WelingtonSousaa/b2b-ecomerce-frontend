'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShoppingCart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  Phone,
  Mail
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 font-sans text-gray-700 text-xs">
      
      {/* 1. OneSync Store Guarantees / Value Proposition Bar */}
      <div className="bg-[#f5f6f6] border-b border-gray-100 py-8 px-4 lg:px-12">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#2563eb] flex items-center justify-center shrink-0 shadow-2xs">
              <Truck className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Frete Grátis</h4>
              <p className="text-gray-500 text-xs mt-0.5">Para compras acima de R$ 200,00</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#2563eb] flex items-center justify-center shrink-0 shadow-2xs">
              <RotateCcw className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">30 Dias para Devolução</h4>
              <p className="text-gray-500 text-xs mt-0.5">Garantia e troca sem complicações</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#2563eb] flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Pagamento Seguro</h4>
              <p className="text-gray-500 text-xs mt-0.5">Ambiente 100% protegido e criptografado</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#2563eb] flex items-center justify-center shrink-0 shadow-2xs">
              <Headphones className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">Suporte 24/7</h4>
              <p className="text-gray-500 text-xs mt-0.5">Atendimento dedicado ao cliente</p>
            </div>
          </div>

        </div>
      </div>

      {/* 2. Main Footer Links Grid */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-12 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 relative h-10 w-32 sm:w-40">
              <Image 
                src="/logo.png" 
                alt="Logo" 
                fill
                className="object-contain object-left" 
              />
            </Link>

            <p className="text-gray-500 text-xs leading-relaxed max-w-sm">
              Sua plataforma de negócios B2B para equipamentos corporativos com entrega rápida e precificação fiscal automatizada por estado.
            </p>

            <div className="space-y-2 pt-2 text-xs font-semibold text-gray-800">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#2563eb]" />
                <span>0800 123 4567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#2563eb]" />
                <span>atendimento@onesync.com.br</span>
              </div>
            </div>
          </div>

          {/* Departamentos (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-gray-900 text-sm tracking-tight">Departamentos</h4>
            <ul className="space-y-2.5 text-xs text-gray-600 font-medium">
              <li><Link href="/produtos?categoria=fones-audio" className="hover:text-[#2563eb] transition-colors">Fones & Áudio</Link></li>
              <li><Link href="/produtos?categoria=computadores-ti" className="hover:text-[#2563eb] transition-colors">Computadores & TI</Link></li>
              <li><Link href="/produtos?categoria=moveis-escritorio" className="hover:text-[#2563eb] transition-colors">Mobiliário Ergonômico</Link></li>
              <li><Link href="/produtos?categoria=redes-servidores" className="hover:text-[#2563eb] transition-colors">Redes & Servidores</Link></li>
              <li><Link href="/produtos?categoria=seguranca-cftv" className="hover:text-[#2563eb] transition-colors">Segurança & CFTV</Link></li>
              <li><Link href="/categorias" className="text-[#2563eb] font-bold hover:underline">Ver Todas as Categorias →</Link></li>
            </ul>
          </div>

          {/* Sobre Nós (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-extrabold text-gray-900 text-sm tracking-tight">Sobre Nós</h4>
            <ul className="space-y-2.5 text-xs text-gray-600 font-medium">
              <li><Link href="/sobre" className="hover:text-[#2563eb] transition-colors">Sobre a OneSync</Link></li>
              <li><Link href="/carreiras" className="hover:text-[#2563eb] transition-colors">Carreiras</Link></li>
              <li><Link href="/noticias" className="hover:text-[#2563eb] transition-colors">Notícias & Blog</Link></li>
              <li><Link href="/faq" className="hover:text-[#2563eb] transition-colors">Ajuda & FAQ</Link></li>
              <li><Link href="/contato" className="hover:text-[#2563eb] transition-colors">Fale Conosco</Link></li>
            </ul>
          </div>

          {/* Ajuda & Suporte (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-gray-900 text-sm tracking-tight">Ajuda & Suporte</h4>
            <ul className="space-y-2.5 text-xs text-gray-600 font-medium">
              <li><Link href="/central-de-atendimento" className="hover:text-[#2563eb] transition-colors">Central de Atendimento</Link></li>
              <li><Link href="/checkout" className="hover:text-[#2563eb] transition-colors">Rastrear Pedido</Link></li>
              <li><Link href="/trocas-e-devolucoes" className="hover:text-[#2563eb] transition-colors">Trocas & Devoluções</Link></li>
              <li><Link href="/envio" className="hover:text-[#2563eb] transition-colors">Informações de Envio</Link></li>
              <li><Link href="/termos" className="hover:text-[#2563eb] transition-colors">Termos & Condições</Link></li>
            </ul>
          </div>

        </div>

        {/* 3. Bottom Legal & Payment Badges Bar */}
        <div className="border-t border-gray-100 pt-8 mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 font-medium text-xs">
          <p>© 2026 OneSync Brasil Ltda. Todos os direitos reservados.</p>

          <div className="flex items-center gap-3">
            <span className="bg-[#f5f6f6] px-2.5 py-1 rounded text-gray-700 font-bold text-[10px]">VISA</span>
            <span className="bg-[#f5f6f6] px-2.5 py-1 rounded text-gray-700 font-bold text-[10px]">Mastercard</span>
            <span className="bg-[#f5f6f6] px-2.5 py-1 rounded text-gray-700 font-bold text-[10px]">PIX</span>
            <span className="bg-[#f5f6f6] px-2.5 py-1 rounded text-gray-700 font-bold text-[10px]">Boleto</span>
          </div>
        </div>

      </div>

    </footer>
  );
}
